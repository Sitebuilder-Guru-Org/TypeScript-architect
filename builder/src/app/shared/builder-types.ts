import {Project} from './projects/Project';

export interface BuilderPage {
    id?: string;
    name: string;
    html: string;
    doc?: Document;
}

export interface BuilderProject {
    model: Project;
    pages: BuilderPage[];
    css: string;
    js: string;
}

export interface BuilderTemplate {
    name: string;
    updated_at: string;
    thumbnail: string;
    pages: BuilderPage[];
    config: BuilderTemplateConfig;
}

export interface BuilderTemplateConfig extends HtmlParserConfig {
    name: string;
    color: string;
    category: string;
    theme: string;
}

export interface HtmlParserConfig {
    includeBootstrap?: boolean;
    includeFontawesome?: boolean;
    nodesToRestore?: string[];
    classesToRemove?: string[];
}

export interface FtpDetails {
    host?: string;
    username?: string;
    password?: string;
    directory?: string;
    port?: number;
    ssl?: boolean;
}
