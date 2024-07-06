
export default function errorHandler(error) {
    if(error.response.status === 401) {
        alert("you are not allowed to access this document")
        window.location.href='/home';
    }else if(error.response.status === 403) {
        alert("session expired!  please login again")
        window.location.href='/login';
    }else if(error.response.status === 404) {
        alert("resource not found")
    }
}
