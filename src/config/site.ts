export const siteConfig = {
  name: "JeffreyLee Blog",
  description: "个人知识库与创作空间，支持图文音视频内容。",
  url: "http://localhost:3000",
  author: "JeffreyLee",
  links: {
    github: "https://github.com",
    twitter: "https://x.com"
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "归档", href: "/archive" },
    { label: "标签", href: "/tags" },
    { label: "留言", href: "/guestbook" },
    { label: "关于", href: "/about" }
  ]
};

export type SiteConfig = typeof siteConfig;

