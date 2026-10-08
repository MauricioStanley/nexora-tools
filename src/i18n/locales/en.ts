/**
 * English UI dictionary — the reference shape for every other locale.
 * Placeholders: `{product}` and `{company}` resolve from brand config automatically.
 * Tool-specific copy lives next to each tool in `src/tools/<id>/i18n/`.
 */
const en = {
  meta: {
    homeTitle: '{product} — Fast, private online tools for PDFs and images',
    homeDescription:
      'Merge, split and compress PDFs, convert and resize images, and create QR codes. Free, no sign-up, and processed right in your browser.',
    titleTemplate: '{title} | {product}',
  },

  common: {
    byCompany: 'by {company}',
    free: 'Free',
    beta: 'Beta',
    comingSoon: 'Coming soon',
    viewAll: 'View all',
    openTool: 'Open tool',
    toolsCount: { one: '{count} tool', other: '{count} tools' },
    close: 'Close',
    or: 'or',
  },

  a11y: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main navigation',
    mobileNav: 'Site menu',
    breadcrumb: 'Breadcrumb',
    footerNav: 'Footer navigation',
    opensInNewTab: '(opens in a new tab)',
    logoHome: '{product} home',
  },

  nav: {
    home: 'Home',
    tools: 'Tools',
    allTools: 'All tools',
    categories: 'Categories',
    about: 'About',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menu: 'Menu',
  },

  search: {
    label: 'Search tools',
    placeholder: 'What do you need to do?',
    placeholderShort: 'Search tools…',
    open: 'Search tools',
    close: 'Close search',
    hint: 'Try “merge pdf”, “compress image” or “qr code”.',
    noResults: 'No tools match “{query}”.',
    noResultsHint: 'Try another word or browse all tools.',
    results: { one: '{count} result', other: '{count} results' },
    loading: 'Loading…',
    loadError: 'Search is unavailable right now. You can still browse all tools.',
    shortcutHint: 'to search',
    navigateHint: 'to navigate',
    selectHint: 'to open',
    suggestions: 'Popular',
    browseAll: 'Browse all tools',
  },

  language: {
    label: 'Language',
    current: 'Current language: {language}',
    suggestion: 'This page is also available in English.',
    suggestionAction: 'View in English',
    dismiss: 'Dismiss',
  },

  theme: {
    label: 'Theme',
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
  },

  home: {
    title: 'Fast, private tools for everyday files.',
    subtitle:
      'Merge PDFs, compress images, convert formats and create QR codes in seconds. Most tools run entirely in your browser, so your files never leave your device.',
    ctaExplore: 'Explore all tools',
    trust: ['Free to use', 'No sign-up', 'Processed on your device'],
    popularTitle: 'Popular tools',
    popularLead: 'The tools people reach for most.',
    recentTitle: 'Recently used',
    categoriesTitle: 'Browse by category',
    categoriesLead: 'Every tool does one job, and does it well.',
    privacyEyebrow: 'Privacy by architecture',
    privacyTitle: 'Your files stay on your device',
    privacyLead:
      'Tools marked “On your device” use your browser’s own engine to process files. Nothing is uploaded, so there is no server that could store, read or leak your documents.',
    privacyFlowDevice: 'Your device',
    privacyFlowBrowser: 'Browser engine',
    privacyFlowResult: 'Your result',
    privacyFlowNoUpload: 'No upload',
    demoFiles: ['contract.pdf', 'annex-a.pdf', 'signatures.pdf'],
    demoResult: 'merged.pdf',
    privacyPoints: [
      {
        title: 'No uploads',
        text: 'Files are read and processed in memory inside the browser tab you are using.',
      },
      {
        title: 'Nothing stored',
        text: 'Results exist only in this tab until you download them, start over or close the page.',
      },
      {
        title: 'Honest labels',
        text: 'Every tool states where it runs. If a future tool needs a server, it will say so clearly.',
      },
    ],
    whyTitle: 'Why {product}',
    why: [
      {
        title: 'Fast',
        text: 'No upload queue and no waiting for a server. Most tasks finish in seconds.',
      },
      {
        title: 'Private by design',
        text: 'Local processing means your documents stay with you, not on someone else’s disk.',
      },
      {
        title: 'No sign-up, no friction',
        text: 'Open a tool, drop a file, download the result. No accounts, emails or watermarks.',
      },
      {
        title: 'Built for mobile',
        text: 'Every tool is designed for phones first, then scaled up for larger screens.',
      },
    ],
    exploreTitle: 'One place for everyday file tasks',
    exploreText: 'PDF, image and utility tools today, with more categories on the way.',
    builtByEyebrow: 'Built by {company}',
    builtByTitle: 'Engineered by a team that builds software for a living',
    builtByText:
      '{product} is designed, built and operated by {company}, a technology company that creates websites, web applications, SaaS products and custom software.',
    builtByCta: 'Visit {company}',
  },

  directory: {
    title: 'All tools',
    seoTitle: 'All online tools: PDF, image and QR code tools',
    seoDescription:
      'Browse every {product} tool: merge, split and compress PDFs, convert and resize images, and create QR codes. Free and private.',
    lead: 'Free tools for PDFs, images and everyday tasks. Pick a tool and get started. No account needed.',
    filterLabel: 'Filter tools',
    filterPlaceholder: 'Filter by name or task…',
    empty: 'No tools match your filter.',
    showing: { one: 'Showing {count} tool', other: 'Showing {count} tools' },
  },

  category: {
    toolsIn: '{category} tools',
    otherCategories: 'Other categories',
    allTools: 'All tools',
  },

  toolPage: {
    howItWorks: 'How it works',
    about: 'About this tool',
    goodToKnow: 'Good to know',
    faq: 'Frequently asked questions',
    related: 'Related tools',
    relatedLead: 'Useful next steps for your files.',
    facts: 'Tool details',
    factsInput: 'Accepts',
    factsOutput: 'Creates',
    factsMaxSize: 'Max file size',
    factsMaxFiles: 'Files per task',
    factsProcessing: 'Processing',
    factsPrice: 'Price',
    factsPriceValue: 'Free, no sign-up',
    perFile: '{size} per file',
    upToFiles: { one: '1 file', other: 'Up to {count} files' },
    noFiles: 'No file needed',
    moreInCategory: 'More {category} tools',
    exploreTitle: 'Need something else?',
    exploreText: 'Browse the full collection of free, private tools.',
    exploreAll: 'Explore all tools',
    appLabel: '{tool} tool',
  },

  privacy: {
    client: {
      label: 'On your device',
      detail: 'Your files never leave your device.',
      detailNoFiles: 'Everything you enter stays on your device.',
    },
    hybrid: {
      label: 'Mostly on your device',
      detail: 'Some steps use a server. Details are listed below.',
    },
    server: {
      label: 'Server processing',
      detail: 'Files are sent to our server to be processed. Details are listed below.',
    },
    external: {
      label: 'External service',
      detail: 'This tool relies on a third-party service. Details are listed below.',
    },
  },

  /** Shared strings for interactive tool islands (serialized into island props). */
  tool: {
    dropzone: {
      titleSingle: 'Drop your file here',
      titleMultiple: 'Drop your files here',
      or: 'or',
      chooseSingle: 'Choose file',
      chooseMultiple: 'Choose files',
      addMore: 'Add more files',
      replace: 'Replace file',
      dragActive: 'Release to add',
      formats: 'Supported: {formats}',
      limitSingle: 'Up to {size}',
      limitMultiple: 'Up to {count} files, {size} each',
      pasteHint: 'Tip: you can also paste an image with Ctrl+V / ⌘+V.',
    },
    fileList: {
      title: 'Selected files',
      count: { one: '{count} file', other: '{count} files' },
      total: '{size} total',
      remove: 'Remove {name}',
      removeAll: 'Remove all',
      moveUp: 'Move {name} up',
      moveDown: 'Move {name} down',
      pages: { one: '{count} page', other: '{count} pages' },
      protected: 'Password-protected',
      damaged: 'Can’t be read',
      inspecting: 'Reading…',
      dimensions: '{width} × {height} px',
      orderHint: 'Files are combined from top to bottom.',
    },
    rejected: {
      title: 'Some files were not added',
      type: '“{name}” isn’t a supported file type.',
      size: '“{name}” is larger than the {size} limit.',
      empty: '“{name}” is empty.',
      count: 'You can add up to {count} files. Extra files were skipped.',
      total: 'The {size} total size limit was reached. Some files were skipped.',
      signature: '“{name}” doesn’t look like a valid {format} file.',
      heic: '“{name}” is a HEIC photo, which browsers can’t convert yet. On iPhone, choose Settings → Camera → Formats → Most Compatible, or share the photo as JPG.',
      dismiss: 'Dismiss',
    },
    actions: {
      cancel: 'Cancel',
      reset: 'Start over',
      download: 'Download',
      downloadAll: 'Download all (ZIP)',
      downloadNamed: 'Download {name}',
      tryAnother: 'Try another file',
      retry: 'Try again',
      newTask: 'Process more files',
    },
    status: {
      idle: 'Waiting for files.',
      ready: { one: '{count} file ready.', other: '{count} files ready.' },
      preparing: 'Preparing…',
      loadingEngine: 'Loading the processing engine…',
      processing: 'Processing…',
      itemProgress: 'Processing {current} of {total}…',
      percent: '{percent}% complete',
      success: 'Done! Your result is ready to download.',
      cancelled: 'Cancelled. Nothing was saved.',
      error: 'The task could not be completed.',
    },
    result: {
      title: 'Your file is ready',
      titleMultiple: 'Your files are ready',
      before: 'Before',
      after: 'After',
      smaller: '{percent} smaller',
      larger: '{percent} larger',
      unchanged: 'Same size',
      keptOriginal: 'Already optimized, original kept',
      continueWith: 'Continue with',
      localNote:
        'Processed on your device. Results stay in this tab only until you download them, start over or leave the page.',
      files: { one: '{count} file', other: '{count} files' },
      bulkNote: 'Many files were created, so they are packaged into a single ZIP download.',
      skipped: {
        one: '{count} file couldn’t be processed and was skipped: {names}',
        other: '{count} files couldn’t be processed and were skipped: {names}',
      },
      limitedByDevice: {
        one: '{count} image was scaled down to fit this device’s memory limits.',
        other: '{count} images were scaled down to fit this device’s memory limits.',
      },
    },
    options: {
      title: 'Options',
      quality: 'Quality',
      qualityLow: 'Smaller file',
      qualityHigh: 'Better quality',
      outputFormat: 'Output format',
      sameFormat: 'Same as original',
    },
    errors: {
      encrypted_pdf: {
        title: 'This PDF is password-protected',
        message:
          'Protected PDFs can’t be processed here yet. Open it in your PDF reader, save or print a copy without protection, then try again.',
      },
      corrupt_pdf: {
        title: 'We couldn’t read this PDF',
        message: 'The file may be damaged or not a real PDF. Try opening it and saving a new copy in a PDF reader.',
      },
      no_pages: {
        title: 'This PDF has no pages',
        message: 'There is nothing to process in this file. Try another PDF.',
      },
      too_many_pages: {
        title: 'This PDF has too many pages',
        message: 'This tool handles up to {count} pages at a time in the browser. Split the PDF first, then process each part.',
      },
      invalid_range: {
        title: 'Check the page numbers',
        message: 'Use page numbers and ranges like “1-3, 5, 8-10”, within the pages this PDF has.',
      },
      unsupported_type: {
        title: 'This file type isn’t supported',
        message: 'Choose a file in one of the supported formats listed above.',
      },
      file_too_large: {
        title: 'This file is too large',
        message: 'Files this size can’t be processed reliably in a browser. Try a smaller file.',
      },
      too_few_files: {
        title: 'Add at least {count} files',
        message: 'This tool needs at least {count} files to work.',
      },
      image_decode_failed: {
        title: 'We couldn’t open this image',
        message: 'The file may be damaged, or it uses a format your browser can’t read.',
      },
      image_too_large: {
        title: 'This image is too large for this device',
        message: 'Your browser can’t allocate enough memory for an image this big. Try a smaller image or a desktop browser.',
      },
      encode_unsupported: {
        title: 'Your browser can’t create this format',
        message: 'Update your browser, or try the latest Chrome, Edge, Firefox or Safari.',
      },
      out_of_memory: {
        title: 'Your device ran out of memory',
        message: 'Try fewer or smaller files, close other tabs, or use a computer.',
      },
      worker_failed: {
        title: 'The processing engine failed to start',
        message: 'Reload the page and try again. If it keeps happening, try another browser.',
      },
      input_required: {
        title: 'Something is missing',
        message: 'Fill in the required fields and try again.',
      },
      unknown: {
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again. If it keeps happening, try another browser.',
      },
    },
    alternative: 'Try {tool} instead',
  },

  footer: {
    tagline: 'Fast, private tools for everyday files.',
    productOf: '{product} is a {company} product.',
    visitCompany: 'Visit {company}',
    company: 'Product',
    legal: 'Legal',
    about: 'About',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact & support',
    rights: '© {year} {company}. All rights reserved.',
    localNote: 'Tools marked “On your device” never upload your files.',
  },

  pages: {
    about: {
      title: 'About {product}',
      seoTitle: 'About {product}',
      seoDescription: '{product} is a collection of fast, private, browser-based tools for everyday files, built and operated by {company}.',
    },
    privacy: {
      title: 'Privacy Policy',
      seoTitle: 'Privacy Policy',
      seoDescription: 'How {product} handles your files and data: local processing, no uploads for on-device tools, and minimal analytics.',
    },
    terms: {
      title: 'Terms of Service',
      seoTitle: 'Terms of Service',
      seoDescription: 'The terms that apply when you use {product}, the free online tools by {company}.',
    },
    contact: {
      title: 'Contact & support',
      seoTitle: 'Contact & support',
      seoDescription: 'Get help with {product}, report a problem, or suggest a new tool.',
      emailLabel: 'Email',
      companyLabel: 'Company website',
    },
    notFound: {
      title: 'Page not found',
      seoTitle: 'Page not found',
      text: 'The page you’re looking for doesn’t exist or has moved.',
      home: 'Go to homepage',
      tools: 'Browse all tools',
    },
    updated: 'Last updated: {date}',
  },

  consent: {
    title: 'Help us improve {product}',
    text: 'We’d like to use Google Analytics to measure which tools are used. We never send file names or file contents.',
    accept: 'Allow analytics',
    decline: 'Decline',
    policy: 'Privacy Policy',
  },

  root: {
    title: 'Choose your language',
    continue: 'Continue in English',
  },
};

export default en;
export type Dictionary = typeof en;
