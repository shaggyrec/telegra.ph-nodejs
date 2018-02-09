function toHtml(data){
    let result = ''
    if(data) {
        data = typeof data !== 'object' ? JSON.parse(data) : data
        for (let item in data) {
            item = data[item]
            result += `<${item.tag}`
            if(item.attrs){
                for(let attr in item.attrs){
                    result += ` ${attr}="${item.attrs[attr]}"`
                }
            }
            result += '>'
                for(let child in item.children){
                    child = item.children[child]
                    // console.log(item.tag)
                    // console.log(child)
                    if(typeof child === 'object'){
                        result +=toHtml(item.children)
                        //console.log(child)
                    }else{
                        result += child
                    }
                }
            result += `</${item.tag}>`
        }
    }
    return result
}
module.exports = {
    toHtml
}