const users = []

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Check if user already exist
    const isUserExisting= users.find((user) => {
        return user.room === room && user.username === username
    })

    // // Validate username
    // if (isUserExisting) {
    //     return {
    //         err: 'Username already is in use!'
    //     }
    // }

    // Store user
    const user = { id, username, room }
    //add user in array (user is js object i.e key value pair)
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    // const index = users.findIndex((user) => user.id === id)

    // if (index !== -1) {
    //     return users.splice(index, 1)[0]
    // }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}