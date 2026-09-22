import React from 'react';
import Link from '@docusaurus/Link';
import SearchBar from '@theme/SearchBar';
export default function NotFoundContent() {
  return (
    <main className="container missing-page">
      <p className="eyebrow">404 · Page not found</p>
      <h1>Find your way back.</h1>
      <p>
        This address does not point to a documentation page. Search for a
        component, error, or concept, or start with the platform overview.
      </p>
      <div className="missing-search">
        <SearchBar />
      </div>
      <Link className="button button--primary" to="/docs/introduction/overview">
        Open documentation
      </Link>
    </main>
  );
}
