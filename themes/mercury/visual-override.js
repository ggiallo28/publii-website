/*
 * Custom function used to generate the output of the override.css file
 */

var generateOverride = function (params) {
    let output = '';

    if (
       params.pageMargin !== '4vw' ||
       params.pageWidth !== '66rem' || 
       params.entryWidth !== '62ch' ||
       params.navbarHeight !== '6rem' || 
       params.gridGap !== '0.5' || 
       params.lineHeight !== '1.6' || 
       params.fontNormalWeight !== '400' || 
       params.fontBoldWeight !== '600' || 
       params.primaryColor !== '#FF80AB' || 
       params.fontHeadignsWeight !== '600' ||
       params.fontHeadingsTransform !== 'none' ||
       params.textColor !== '#111111' ||
       params.headingsColor !== '#111111') {
       output += `
       :root {
          --page-margin:        ${params.pageMargin};
          --page-width:         ${params.pageWidth}; 
          --entry-width:        ${params.entryWidth}; 
          --header-height:      4rem; 
          --border-radius:      2px;
          --grid-gap:           ${params.gridGap}rem; 
          --font-weight-normal: ${params.fontNormalWeight}; 
          --font-weight-bold:   ${params.fontBoldWeight}; 
          --line-height:        ${params.lineHeight}; 
          --headings-weight:    ${params.fontHeadignsWeight};
          --headings-transform: ${params.fontHeadingsTransform};
          --white:              #FFFFFF;
          --black:              #000000;
          --dark:               #111111;
          --gray-1:             #686868;
          --gray-2:             #888888;
          --light:              #D5D5D5;
          --lighter:            #F5F5F5;
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
                   font-size: calc(${params.minFontSize}rem + (${params.maxFontSize} - ${params.minFontSize}) * ((100vw - 20rem) / 113));
               }
        }

        @media screen and (min-width: 133rem) {
               html {
                   font-size: ${params.maxFontSize}rem;
               }
        }`;
    }

    if(params.primaryColor !== '#FF80AB') {
       output += `
       input[type=checkbox]:checked+label:before,
       input[type=radio]:checked+label:before {   
       background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 8'%3e%3cpolygon points='9.53 0 4.4 5.09 1.47 2.18 0 3.64 2.93 6.54 4.4 8 5.87 6.54 11 1.46 9.53 0' fill='${params.primaryColor.replace('#', '%23')}'/%3e%3c/svg%3e");
       }

       input[type=radio]:checked+label:before {
              background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3ccircle cx='4' cy='4' r='4' fill='${params.primaryColor.replace('#', '%23')}'/%3e%3c/svg%3e");
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

   
    if(params.gridType === 'fitRows'){
        output += `
        .l-col .c-card__header img {
               height: ${params.cardsHeight};
        }`;
    }
    if(params.cardsImgScale !== '1.3') {
        output += `
        .c-card:hover .c-card__header > img {
               -webkit-transform: scale(${params.cardsImgScale});
              transform: scale(${params.cardsImgScale});
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
