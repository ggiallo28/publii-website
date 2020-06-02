/*
 * Custom function used to generate the output of the override.css file
 */

var generateOverride = function (params) {
    let output = '';

    if (
       params.pageMargin !== '6vw' ||
       params.pageWidth !== '1200px' || 
       params.entryWidth !== '62ch' ||
       params.navbarHeight !== '4rem' || 
       params.cardsImageHeight !== '9rem' ||
       params.lineHeight !== '1.6' || 
       params.fontNormalWeight !== '400' || 
       params.fontBoldWeight !== '600' || 
       params.primaryColor !== '#FF5151' || 
       params.fontHeadignsWeight !== '600' ||
       params.fontHeadingsTransform !== 'none' ||
       params.textColor !== '#343435' ||
       params.headingsColor !== '#101011') {
       output += `
       :root {
          --page-margin:        ${params.pageMargin};
          --page-width:         ${params.pageWidth}; 
          --entry-width:        ${params.entryWidth}; 
          --header-height:      4rem; 
          --border-radius:      8px;
          --card-image-height:  ${params.cardsImageHeight};
          --line-height:        ${params.lineHeight}; 
          --font-weight-normal: ${params.fontNormalWeight}; 
          --font-weight-bold:   ${params.fontBoldWeight}; 
          --headings-weight:    ${params.fontHeadignsWeight};
          --headings-transform: ${params.fontHeadingsTransform};
          --white:              #FFFFFF;
          --black:              #000000;
          --dark:               #101011;
          --gray-1:             #343435;
          --gray-2:             #6D6E6F;
          --light:              #D5D5D5;
          --lighter:            #F3F3F3;
          --color:              ${params.primaryColor};   
          --color-rgb:          ${params.primaryColor.replace('#', '').match(/[a-f0-9]{2,2}/gmi).map(n => parseInt(n, 16)).join(', ')};
          --text-color:         ${params.textColor};   
          --headings-color:     ${params.headingsColor}; 
       }
       
       @media all and (min-width: 56.25em) {
              :root {
                --header-height: ${params.navbarHeight};
              }
        }`;
   }   

    if(params.minFontSize !== '1' || params.maxFontSize !== '1.2') {
        output += `
        html {
               font-size: ${params.minFontSize}rem;
        }

        @media screen and (min-width: 20rem) {
          html {
               font-size: calc(${params.minFontSize}rem + (${params.maxFontSize} - ${params.minFontSize}) * ((100vw - 20rem) / 86));
          }
        }

        @media screen and (min-width: 106rem) {
          html {
               font-size: ${params.maxFontSize}rem;
            }
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
