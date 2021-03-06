import sys

sys.path.insert(0, "libs")

from collections import namedtuple
from bs4 import BeautifulSoup
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
		(' ' if source_text[0].isspace() else '') +\
		response['TranslatedText'] +\
		(' ' if source_text[-1].isspace() and len(source_text) > 1 else '')

	return response['TranslatedText']
	
def get_from_s3(bucket, key, local_path):
	with open(local_path, 'wb') as f:
		s3.download_fileobj( bucket, key, f)
	with open(local_path, 'rb') as file:
		return 	file.read()
	
def save_to_s3(data, bucket, key, local_path, extra_args):
	with open(local_path, "w") as file:
		file.write(data)
	with open(local_path, 'rb') as obj:
		s3.upload_fileobj(obj, bucket, key, ExtraArgs=extra_args)

	
def handler(event, context):
	page = s3_parse_event(event)

	if page.key.startswith(exclude_prefix):
		print(f'Skip {page.key}')
		return

	print(f'Translate {page.key}, {page.bucket}...')

	path_file = f'/tmp/{page.key}'
	os.makedirs(os.path.dirname(path_file), exist_ok=True)
	
	html = get_from_s3(page.bucket, page.key, path_file)
	soup = BeautifulSoup(html, 'html.parser')
	
	try:
		translate_cache = json.loads(get_from_s3(page.bucket, f'it/{page.key}.json', path_file))
	except:
		print("Create new empty Translate Cache")
		translate_cache = {}

	main_tag = soup.find('main')

	skip_translate, skip_texts = main_tag.findAll(text=True, class_='skip_translate'), []
	skip_translate += main_tag.findAll(text=False, class_='skip_translate')
	
	for value in skip_translate:
	    skip_texts += value.findAll(text=True)

	skip_texts = [id(t) for t in skip_texts]
	new_translate_cache = {}
	for text in main_tag.findAll(text=True):
		if id(text) in skip_texts:
			continue

		if text in translate_cache:
			translated_text = translate_cache[text]
		elif text in new_translate_cache:
			translated_text = new_translate_cache[text]
		else:
			translated_text = translate(text)
		
		new_translate_cache[text] = translated_text
			
		text.replaceWith(translated_text)
	
	extra_args = {
		'ACL' : 'public-read',
		'CacheControl': 'no-cache, no-store',
		'ContentType': 'text/html'
	}
	
	save_to_s3(str(soup), page.bucket, f'it/{page.key}', path_file, extra_args)
	save_to_s3(json.dumps(new_translate_cache), page.bucket, f'it/{page.key}.json', path_file, extra_args)
	
	print('Done')
	