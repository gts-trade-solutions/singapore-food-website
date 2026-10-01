export const INTRO_SESSION_KEY = "rjs-intro-seen";

/**
 * Runs before paint (inlined in <body>). Returning visitors, phones (< 768px, where
 * time-to-content matters most) and reduced-motion users get `html.intro-skip`,
 * which hides the intro loader in CSS so it never flashes.
 */
export const introSkipScript = `try{if(sessionStorage.getItem('${INTRO_SESSION_KEY}')==='1'||matchMedia('(max-width: 767px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-skip')}}catch(e){document.documentElement.classList.add('intro-skip')}`;
