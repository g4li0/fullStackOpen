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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}