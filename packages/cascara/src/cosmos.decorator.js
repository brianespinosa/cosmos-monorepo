// NOTE: This decorator is inherited by all fixtures in this directory.
//
// Decorators are inherited from parent folders. Please check that there
// is not another decorator higher up in the directory tree that is not already
// adding something we need. If a fixture has unique needs, a decorater can be
// created in child directories to extend this further.

// import React, { StrictMode } from 'react';
import '@espressive/legacy-css';
import 'normalize.css';

// one of these exports is needed or else this decorator mutes all fixture children

// USE THIS EXPORT FOR STRICT MODE
// export default ({ children }) => <StrictMode>{children}</StrictMode>;

// USE THIS EXPORT TO REMOVE STRICT MODE ERRORS
export default ({ children }) => children;
