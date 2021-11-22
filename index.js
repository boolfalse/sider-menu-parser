
const { parse: index } = require('node-html-parser');

fs = require('fs')
fs.readFile('./sider.html', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    const root = index(data);

    let menu = [];
    const categories = root.querySelectorAll('.level-0'); // .level-0

    categories.forEach((category, k) => {
        let categoryImg = category.querySelector('a.level-0-link img');
        let menuItem = {
            name: categoryImg.attributes.alt,
            image: categoryImg.attributes['data-src'],
        };

        let menuSubItems = [];
        // .level-0 .level-1-container .level-1
        let subcategories = category.querySelectorAll('.level-1-container .level-1');

        subcategories.forEach((subcategory, i) => {
            if (i > 0) {
                let subcategoryImg = subcategory.querySelector('a.level-1-link img');
                let menuSubItem = {
                    name: subcategoryImg.attributes.alt,
                    image: subcategoryImg.attributes['data-src'],
                };

                let menuSubSubItems = [];
                // .level-0 .level-1-container .level-1 .level-2-container .level-2
                let subsubcategories = subcategory.querySelectorAll('.level-2-container .level-2');
                subsubcategories.forEach((subsubcategory, j) => {
                    if (j > 0) {
                        let subsubcategoryImg = subsubcategory.querySelector('a.level-2-link img');
                        if (subsubcategoryImg) {
                            menuSubSubItems.push({
                                name: subsubcategoryImg.attributes.alt,
                                image: subsubcategoryImg.attributes['data-src'],
                            });
                        }
                    }
                });

                menuSubItem.children = menuSubSubItems;
                menuSubItems.push(menuSubItem);
            }
        });

        menuItem.children = menuSubItems;
        menu.push(menuItem);
    });

    fs.truncate('result.json', 0, function() { })
    fs.writeFile('result.json', JSON.stringify(menu), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('OK!');
        }
    });
});


