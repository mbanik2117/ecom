/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.shopstrider.com',
    generateRobotsTxt: true, // Generates robots.txt file
    sitemapSize: 7000, // Split sitemap if it exceeds the size limit
    changefreq: 'daily', // Change frequency of content updates
    priority: 0.7, // Priority of the URLs
    exclude: ['/admin/*'], // Exclude specific routes if necessary
    transform: async (config, path) => {
      return {
        loc: path, // The path of the page
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: new Date().toISOString(),
      }
    },
  }
  