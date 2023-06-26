const main = async () => {
    let resp;

    const dataList = $("#datalistOptions")[0]
    let res = await fetch("https://countriesnow.space/api/v0.1/countries")
    res = await res.json()
    resp = await res.data.map(country => {
        country.cities.map(city => {
            const option = new Option("", city + ", " + country.country)
            dataList.appendChild(option)
            return city
        })
    })
}
main()
