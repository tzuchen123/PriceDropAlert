const siteConfigs = [
    // 完成
    {
        name: "URBAN RESEARCH TW",
        urlPattern: "https://www.urban-research.tw/",
        crawler: "axios", // 預設使用 axios
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
        crawler: "puppeteer",
        selectors: {
            product_name: ".dtl-Product_Title",
            brand_name: ".dtl-Product_ShopName dd a", // 取第一個品牌名稱
            original_price: ".price_BeforePrice",
            sale_price: ".price.is-pricedown"
        }
    },
    {
        name: "UNITED ARROWS TW",
        urlPattern: "https://store.united-arrows.tw/",
        crawler: "axios", // 預設使用 axios
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
        crawler: "axios", // 預設使用 axios
        selectors: {
            product_name: ".title",
            brand_name: ".brand-link",
            original_price: ".was-price",
            sale_price: ".new-price"
        }
    },
    {
        name: "dot st TW",
        urlPattern: "https://www.dot-st.tw/",
        crawler: "axios", // 預設使用 axios
        selectors: {
            product_name: ".salepage-title",
            original_price: ".salepage-suggestprice",
            sale_price: ".salepage-price span",
        }
    },
    {
        name: "dot st JP",
        urlPattern: "https://www.dot-st.com/",
        crawler: "axios", // 預設使用 axios
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
