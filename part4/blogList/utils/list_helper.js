const dummy = (blogs) => {
    return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum,blog) => sum + blog.likes,0)
}

module.exports = {
    dummy,
    totalLikes
}