const siteConfigs = [
    {
        name: "URBAN RESEARCH TW",
        urlPattern: "https://www.urban-research.tw/",
        selectors: {
            productName: ".product-title",
            brandName: ".brand a",
            originalPrice: ".old-price",
            salePrice: ".current-price"
        }
    },
    {
        name: "URBAN RESEARCH JP",
        urlPattern: "https://www.urban-research.jp/",
        selectors: {
            productName: ".title",
            brandName: ".brand-link",
            originalPrice: ".was-price",
            salePrice: ".new-price"
        }
    },
    {
        name: "UNITED ARROWS TW",
        urlPattern: "https://store.united-arrows.tw/",
        selectors: {
            productName: ".title",
            brandName: ".brand-link",
            originalPrice: ".was-price",
            salePrice: ".new-price"
        }
    },
    {
        name: "UNITED ARROWS JP",
        urlPattern: "https://store.united-arrows.co.jp/",
        selectors: {
            productName: ".title",
            brandName: ".brand-link",
            originalPrice: ".was-price",
            salePrice: ".new-price"
        }
    },
    {
        name: "dot st TW",
        urlPattern: "https://www.dot-st.tw/",
        selectors: {
            productName: ".title",
            brandName: ".brand-link",
            originalPrice: ".was-price",
            salePrice: ".new-price"
        }
    },
    {
        name: "dot st JP",
        urlPattern: "https://www.dot-st.com/",
        selectors: {
            productName: ".title",
            brandName: ".brand-link",
            originalPrice: ".was-price",
            salePrice: ".new-price"
        }
    }
];

function getSiteConfig(url) {
    return siteConfigs.find(config => url.includes(config.urlPattern));
}

module.exports = { getSiteConfig };

