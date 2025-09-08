# Recipe Scanner

Do you also have a good amount of printed-out or hand-written recipes which you want to digitalize? You came to the right place!

This tool allows you to easily turn photos of your recipes into a machine-readable format.

The output format is a subset of the [schema.org Recipe](https://schema.org/Recipe) and can be expanded (merge request are welcome).

## Prerequisites

To run this project locally you need

1. Node.js (or an alternative)
2. [LM Studio](https://lmstudio.ai/) and a vision Large Language Model (e.g. `mistralai/mistral-small-3.2`)

## Setup

Install dependencies of the application

```bash
pnpm install
```

Start LM Studio, go to Developer tab, start server and load a model.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```
