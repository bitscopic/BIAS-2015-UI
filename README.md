## BIAS-2015-UI

This web-based application provides a visualization tool for analyzing genomic variants and alongside their ACMG classifications.

Users can upload a TSV to view, analyze, and modify variant classifications, scores, and rationales. After making edits, they can export the modified data for further processing, including re-analysis with [BIAS-2015](https://github.com/bitscopic/BIAS-2015).

While the application was designed primarily to aid the analysis and iterative improvement of the [BIAS-2015](https://github.com/bitscopic/BIAS-2015) algorithm, the application accepts a TSV file as input, so using [BIAS-2015](https://github.com/bitscopic/BIAS-2015) to generate the input is not required.
A sample TSV file is provided as a template which can be used to build and process your own data.

This tool streamlines the process of reviewing and editing genomic variant classifications, enhancing the efficiency of genetic data analysis.

## Getting Started

### Prerequisites

This project requires [Node.js](https://nodejs.org/en/download/) to be installed on your machine.

### Running the Application

1. Install the required Node modules:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Naviage to **[http://localhost:3000](http://localhost:3000)** with your browser to use the application.

## Features

- **Data Upload and Template Download:** Users can upload their own variant data in TSV format and download a sample template to ensure proper formatting.

- **Interactive Data Table:** The application displays variant data in a structured table, including columns for Gene, c., p., Consequence, Classification, and ACMG Rationale.

- **Data Export:** After analysis and modification, users can download the updated dataset for further use.
