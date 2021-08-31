const borders = {
    map: [
            {
                "id": "cherkasy",
                "neighbours": ["vinnytsia", "kyiv", "poltava", "kirovohrad"]
            },
            {
                "id": "chernihiv",
                "neighbours": ["sumy", "poltava", "kyiv"]
            },
            {
                "id": "chernivtsi",
                "neighbours": ["ivano-frankivsk", "ternopil", "khmelnytskyi", "vinnytsia"]
            },
            {
                "id": "crimea",
                "neighbours": ["kherson"]
            },
            {
                "id": "dnipropetrovsk",
                "neighbours": ["zaporizhia", "kherson", "mykolaiv", "kirovohrad", "poltava", "kharkiv", "donetsk"]
            },
            {
                "id": "donetsk",
                "neighbours": ["zaporizhia", "dnipropetrovsk", "kharkiv", "luhansk"]
            },
            {
                "id": "ivano-frankivsk",
                "neighbours": ["zakarpattia", "lviv", "ternopil", "chernivtsi"]
            },
            {
                "id": "kharkiv",
                "neighbours": ["luhansk", "donetsk", "dnipropetrovsk", "poltava", "sumy"]
            },
            {
                "id": "kherson",
                "neighbours": ["mykolaiv", "dnipropetrovsk", "zaporizhia", "crimea"]
            },
            {
                "id": "khmelnytskyi",
                "neighbours": ["chernivtsi", "ternopil", "rivne", "zhytomyr", "vinnytsia",]
            },
            {
                "id": "kirovohrad",
                "neighbours": ["odessa", "vinnytsia", "cherkasy", "poltava", "dnipropetrovsk", "mykolaiv"]
            },
            {
                "id": "kyiv",
                "neighbours": ["chernihiv", "poltava", "cherkasy", "vinnytsia", "zhytomyr"]
            },
            {
                "id": "kyiv-city",
                "neighbours": ["kyiv"]
            },
            {
                "id": "luhansk",
                "neighbours": ["donetsk", "kharkiv"]
            },
            {
                "id": "lviv",
                "neighbours": ["zakarpattia", "ivano-frankivsk", "ternopil", "rivne", "volyn"]
            },
            {
                "id": "mykolaiv",
                "neighbours": ["odessa", "kirovohrad", "dnipropetrovsk", "kherson"]
            },
            {
                "id": "odessa",
                "neighbours": ["vinnytsia", "kirovohrad", "mykolaiv"]
            },
            {
                "id": "poltava",
                "neighbours": ["kharkiv", "dnipropetrovsk", "kirovohrad", "cherkasy", "kyiv", "chernihiv", "sumy"]
            },
            {
                "id": "rivne",
                "neighbours": ["volyn", "lviv", "ternopil", "khmelnytskyi", "zhytomyr"]
            },
            {
                "id": "sumy",
                "neighbours": ["kharkiv", "poltava","chernihiv"]
            },
            {
                "id": "ternopil",
                "neighbours": ["ivano-frankivsk", "lviv", "rivne", "khmelnytskyi", "chernivtsi"]
            },
            {
                "id": "vinnytsia",
                "neighbours": ["chernivtsi", "khmelnytskyi", "zhytomyr", "kyiv", "cherkasy", "kirovohrad", "odessa"]
            },
            {
                "id": "volyn",
                "neighbours": ["lviv", "rivne"]
            },
            {
                "id": "zakarpattia",
                "neighbours": ["lviv", "ivano-frankivsk"]
            },
            {
                "id": "zaporizhia",
                "neighbours": ["kherson", "dnipropetrovsk", "donetsk"]
            },
            {
                "id": "zhytomyr",
                "neighbours": ["rivne", "khmelnytskyi", "vinnytsia", "kyiv"]
            }
        ]
}

module.exports.borders = borders;