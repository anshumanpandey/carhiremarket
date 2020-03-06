const axios = require('axios').default;

const POST_DATA = `<OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" Target="Test" Version="1.005">
<POS>
<Source>
<RequestorID Type="5" ID="flex87098" />
</Source>
</POS>
<VehAvailRQCore Status="Available">
<VehRentalCore PickUpDateTime="2020-04-02T13:15:00" ReturnDateTime="2020-04-02T14:20:00">
<PickUpLocation LocationCode="HERA01" />
<ReturnLocation LocationCode="HERA01"/>
</VehRentalCore>
<DriverType Age="30"/>
</VehAvailRQCore>
<VehAvailRQInfo>
<Customer>
<Primary>
<CitizenCountryName Code="US"/>
</Primary>
</Customer>
<TPA_Extensions>
<ConsumerIP>192.168.102.14</ConsumerIP>
</TPA_Extensions></VehAvailRQInfo></OTA_VehAvailRateRQ>`;

const getData = axios.post("https://ota.right-cars.com/", POST_DATA, {
    headers: {
        ["Content-Type"]: "application/soap+xml",
        "charset": "utf-8"
    }
})

module.exports = getData;
