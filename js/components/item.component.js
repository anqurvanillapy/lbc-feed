'use strict'

let tags = '<li>OK</li>'

let tagsArray = []
for (let i = 0; i < 2; ++i) tagsArray.push(tags)

render('item__tags', tagsArray.join(''))
