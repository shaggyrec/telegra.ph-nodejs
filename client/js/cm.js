// var quill = new Quill('#container', {
//     modules: {
//         toolbar: [
//             [{ header: [1, 2, false] }],
//             ['bold', 'italic', 'underline'],
//             ['link', 'code-block']
//         ]
//     },
//     scrollingContainer: '#scrolling-container',
//     placeholder: 'Compose an epic...',
//     theme: 'bubble'
// });

var T={"apiUrl":"\/edit","datetime":0,"pageId":0};(function(){var b=document.querySelector('time');if(b&&T.datetime){var a=new Date(1E3*T.datetime),d='January February March April May June July August September October November December'.split(' ')[a.getMonth()],c=a.getDate();b.innerText=d+' '+(10>c?'0':'')+c+', '+a.getFullYear()}})();