export type SectionType = 
  | "hero" 
  | "marquee" 
  | "categories" 
  | "featured_products" 
  | "offers" 
  | "testimonials" 
  | "faq" 
  | "about"
  | "blog";

export interface HomepageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data: any;
}

export interface HomepageConfig {
  seo: {
    title: string;
    description: string;
  };
  announcement_bar: {
    enabled: boolean;
    text: string;
    link: string;
  };
  sections: HomepageSection[];
}
