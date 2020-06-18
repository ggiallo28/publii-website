import sys

sys.path.insert(0, "libs")

from collections import namedtuple
from bs4 import BeautifulSoup
from bs4.element import Comment
import boto3
import json
import os

exclude_prefix = ('cv', 'it')

tr = boto3.client('translate')
s3 = boto3.client('s3')

CUSTOM_TERMINOLOGY = os.environ['CUSTOM_TERMINOLOGY']

def s3_parse_event(event):
	bucket = event['Records'][0]['s3']['bucket']['name']
	key = event['Records'][0]['s3']['object']['key']
	Page = namedtuple('Page', 'bucket key')

	return Page(bucket, key)
    
def translate(source_text):
	request_body = {
		'Text': source_text,
		'SourceLanguageCode': 'en',
		'TargetLanguageCode': 'it',
		'TerminologyNames': [CUSTOM_TERMINOLOGY]
	}

	response = tr.translate_text(**request_body)

	response['TranslatedText'] =\
		(' ' if source_text[0] == ' ' else '') +\
		response['TranslatedText'] +\
		(' ' if source_text[-1] == ' ' else '')

	return response['TranslatedText']
      
def handler(event, context):

	page = s3_parse_event(event)

	if page.key.startswith(exclude_prefix):
		print(f'Skip {page.key}')
		return

	print(f'Translate {page.key}, {page.bucket}...')

	path_file = f'/tmp/{page.key}'
	os.makedirs(os.path.dirname(path_file), exist_ok=True)

	with open(path_file, 'wb') as f:
		s3.download_fileobj( page.bucket, page.key, f)

	with open(path_file, 'rb') as file:
		soup = BeautifulSoup(file.read(), 'html.parser')

	main_tag = soup.find('main')

	for text in main_tag.findAll(text=True):
		translated_text = translate(text)
		text.replaceWith(translated_text)

	with open(path_file, "w") as file:
		file.write(str(soup))
  
	extra_args = {
		'ACL' : 'public-read',
		'CacheControl': 'no-cache, no-store',
		'ContentType': 'text/html'
	}

	with open(path_file, 'rb') as data:
		s3.upload_fileobj(data, page.bucket, f'it/{page.key}', ExtraArgs=extra_args)
	
	print('Done')
	