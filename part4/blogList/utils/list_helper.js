const dummy = (blogs) => {
    return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum,blog) => sum + blog.likes,0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length<1){
        return {}
    }
    const sorted = blogs.slice().sort((b1,b2) => b2.likes - b1.likes)
    return sorted[0]
}

const mostBlogs = (blogs) => {
    if(blogs.length<1)
        return {}
    const authors = []
    for(let blog of blogs) {
        const author = authors.find(a => a.author === blog.author)
        if(author){
            author.blogs++
        } else {
            authors.push({author: blog.author, blogs: 1})
        }
    
    }
    return authors.reduce((a,b) => a.blogs > b.blogs ? a : b)
}

const mostLikes = (blogs) => {
    if(blogs.length<1)
        return {}
    const authors = []
    for(let blog of blogs) {
        const author = authors.find(a => a.author === blog.author)
        if(author){
            author.likes+=blog.likes
        } else {
            authors.push({author: blog.author, likes: blog.likes})
        }
    
    }
    return authors.reduce((a,b) => a.likes > b.likes ? a : b)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}