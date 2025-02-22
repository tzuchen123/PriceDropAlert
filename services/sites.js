const siteConfigs = [
    // 完成
    {
        name: "URBAN RESEARCH TW",
        urlPattern: "https://www.urban-research.tw/",
        selectors: {
            product_name: ".itemName",
            brand_name: ".brandeName a",
            original_price: ".priceBefore",
            sale_price: ".priceAfter"
        }
    },
    {
        name: "URBAN RESEARCH JP",
        urlPattern: "https://www.urban-research.jp/",
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    {
        name: "UNITED ARROWS TW",
        urlPattern: "https://store.united-arrows.tw/",
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    {
        name: "UNITED ARROWS JP",
        urlPattern: "https://store.united-arrows.co.jp/",
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    // 完成
    {
        name: "dot st TW",
        urlPattern: "https://www.dot-st.tw/",
        selectors: {
            product_name: ".salepage-title",
            original_price: ".salepage-suggestprice",
            sale_price: ".salepage-price span",
        }
    },
    {
        name: "dot st JP",
        urlPattern: "https://www.dot-st.com/",
        selectors: {
            product_name: ".item-name",
            brand_name: ".item-detail-brand dd",
            original_price: "#code-05 .item-price, #code-09 .item-price, #code-12 .item-price, #code-19 .item-price, #code-default .item-price",
            sale_price: "#code-09 .item-price",
        }
    }
];

function getSiteConfig(url) {
    return siteConfigs.find(config => url.includes(config.urlPattern));
}

module.exports = { getSiteConfig };

