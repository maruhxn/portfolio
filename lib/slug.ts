import GithubSlugger from "github-slugger";

export function slugify(text: string): string {
  return new GithubSlugger().slug(text);
}
