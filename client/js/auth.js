function onTelegramAuth(user) {
    $.ajax({
        url: '/login',
        method: 'post',
        data: user,
        dataType:'json',
        success: function (data) {
            location.reload()
        },
        error: function (error) {
            alert(error)
        }
    })
}
