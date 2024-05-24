export const HTTPCall = async (path:string, method = "GET", body:object|null = null) => {
    let options:RequestInit = {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
    }

    if (body) {
        options = {...options, body: JSON.stringify(body),}
    }

    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(`http://localhost:3255${path}`, options)
            if (res.ok) {
                return resolve([{
                    data: await res.json(),
                    status: res.status,
                    ok: res.ok
                }, null])
            } else {
                resolve([null, {data: await res.json(), status: res.status}])
            }
        }catch (e) {
            resolve([null, e])
        }
    })
}