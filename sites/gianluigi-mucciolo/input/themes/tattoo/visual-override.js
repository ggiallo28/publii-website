/*
 * Custom function used to generate the output of the override.css file
 */

var generateOverride = function (params) {   
    let output = '';

    if (
       params.pageMargin !== '4vw' ||
       params.pageWidth !== '64rem' || 
       params.entryWidth !== '62ch' ||
       params.backgroundHero !== '#111111' ||
       params.navbarHeight !== '4.5rem' || 
       params.heightMinHero !== '20rem' || 
       params.heightMaxHero !== '45rem' || 
       params.opacityHero !== '0.6' || 
	params.gridGap !== '0.75' || 
       params.cardHeight !== '20rem' || 
       params.cardsOpacity !== '0.4' || 
	params.cardsAccentOpacity !== '0.95' || 
	params.layoutTypeBorderRadius !== '3' || 
       params.lineHeight !== '1.6' || 
       params.fontNormalWeight !== '400' || 
       params.fontBoldWeight !== '600' || 
       params.primaryColor !== '#6B78B4' || 
       params.fontHeadignsWeight !== '400' ||
       params.fontHeadingsTransform !== 'none' ||
       params.textColor !== '#111111' ||
       params.headingsColor !== '#111111') {
       output += `
       :root {
          --page-margin:        ${params.pageMargin};
          --page-width:         ${params.pageWidth}; 
          --entry-width:        ${params.entryWidth}; 
          --hero-bg:            ${params.backgroundHero};
          --header-height:      ${params.navbarHeight};
          --hero-min-height:    ${params.heightMinHero};
          --hero-max-height:    ${params.heightMaxHero};
          --hero-opacity:       ${params.opacityHero};
          --grid-gap:           ${params.gridGap}rem;
          --card-height:        ${params.cardHeight};
          --card-opacity:       ${params.cardsOpacity};
          --card-accent-opacity:${params.cardsAccentOpacity};
          --border-radius:      ${params.layoutTypeBorderRadius}px;
          --line-height:        ${params.lineHeight}; 
          --font-weight-normal: ${params.fontNormalWeight}; 
          --font-weight-bold:   ${params.fontBoldWeight}; 
          --headings-weight:    ${params.fontHeadignsWeight};
          --headings-transform: ${params.fontHeadingsTransform};
          --white:              #FFFFFF;
          --black:              #000000;
          --dark:               #111111;
          --gray-1:             #6C6C6F;
          --gray-2:             #747577;
          --light:              #D5D5D5;
          --lighter:            #F3F3F3;
          --color:              ${params.primaryColor};   
          --color-rgb:          ${params.primaryColor.replace('#', '').match(/[a-f0-9]{2,2}/gmi).map(n => parseInt(n, 16)).join(', ')};
          --text-color:         ${params.textColor};   
          --headings-color:     ${params.headingsColor}; 
       }`;
   }   

   if(params.minFontSize !== '1' || params.maxFontSize !== '1.2') {
        output += `
        html {
               font-size: ${params.minFontSize}rem;
        }

        @media screen and (min-width: 20rem) {
               html {
                   font-size: calc(${params.minFontSize}rem + (${params.maxFontSize} - ${params.minFontSize}) * ((100vw - 20rem) / 46));
                }
        }

        @media screen and (min-width: 66rem) {
               html { 
                   font-size: ${params.maxFontSize}rem;
               }
        }`;    	 
   }
	
   if(params.cardImgScale !== '1.6' || params.cardsImgRotate !== '-10') {
        output += ` 
        .card:hover .card__image img {
               -webkit-transform: scale(${params.cardImgScale}) rotate(${params.cardsImgRotate}deg);
               transform: scale(${params.cardImgScale}) rotate(${params.cardsImgRotate}deg);
         }`;    	 
   }
    
   if (params.submenu === 'custom') {
        output += `
        .navbar .navbar__submenu {
               width: ${params.submenuWidth}px;     
        }

        .navbar .navbar__menu--wide .has-submenu:active > .navbar__submenu,
        .navbar .navbar__menu--wide .has-submenu:focus > .navbar__submenu,
        .navbar .navbar__menu--wide .has-submenu:hover > .navbar__submenu  {
               min-width: ${params.submenuWidth}px;
        }

        .navbar .has-submenu .has-submenu:active > .navbar__submenu,
        .navbar .has-submenu .has-submenu:focus > .navbar__submenu,
        .navbar .has-submenu .has-submenu:hover > .navbar__submenu {
               left: ${params.submenuWidth}px;  
        }
        .navbar .has-submenu .has-submenu:active > .navbar__submenu.is-right-submenu,
        .navbar .has-submenu .has-submenu:focus > .navbar__submenu.is-right-submenu,
        .navbar .has-submenu .has-submenu:hover > .navbar__submenu.is-right-submenu {
               left: -${params.submenuWidth}px; 
        }`;
    }     
	
   if(params.galleryItemGap !== '0.5rem') {
        output += `   
        .gallery__item {
               padding: ${params.galleryItemGap}; 
        } 
        .gallery {   
               margin: calc(1.5rem + 1vw) -${params.galleryItemGap}; 
        }`;    	 
   }	
	
   if(params.lazyLoadEffect === 'fadein') {
        output += ` 
         img[loading] {
               opacity: 0;
         }

         img.is-loaded {
               opacity: 1;
               transition: all 1s cubic-bezier(0.215, 0.61, 0.355, 1); 
         }`;    	 
    } 
	
 return output;
}

module.exports = generateOverride;
