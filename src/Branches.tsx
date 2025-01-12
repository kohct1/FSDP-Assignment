// react
import { useState, useEffect } from "react";

// leaflet
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import Navbar from "./components/Navbar";

// components
import BranchMarkers from "./components/BranchMarkers";
import BranchButton from "./components/BranchButton";
import BranchSearch from "./components/BranchSearch";
import { Checkbox } from "./components/ui/checkbox";

function Branches() {
    const [branches, setBranches] = useState<object[]>([]);

    const data = [{
                "category": "Bank Branch",
                "address": "1 Jurong West Central 2 #B1-31/32/33/46 Jurong Point Shopping Centre",
                "landmark": "Jurong Point Branch",
                "latitude": 1.3395077,
                "longitude": 103.7067438,
                "postalCode": "648886",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "1 Maritime Square #02-99/100 HarbourFront Centre",
                "landmark": "HarbourFront Branch",
                "latitude": 1.263904,
                "longitude": 103.8201912,
                "postalCode": "099253",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "1 Woodlands Square #01-16 Causeway Point",
                "landmark": "Causeway Point Branch",
                "latitude": 1.4360915,
                "longitude": 103.7859058,
                "postalCode": "738099",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "50 Jurong Gateway Road #B1-18 Jem",
                "landmark": "Jurong East Branch",
                "latitude": 1.333066,
                "longitude": 103.743657,
                "postalCode": "608549",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "204 Bedok North St 1 #01-403/405/407",
                "landmark": "Bedok Branch",
                "latitude": 1.3263064,
                "longitude": 103.930105,
                "postalCode": "460204",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "20 Lorong Mambong (with Premier Banking centre)",
                "landmark": "Holland Village Branch",
                "latitude": 1.31142307,
                "longitude": 103.79509881,
                "postalCode": "277679",
                "openingHours": "Mon - Fri: 11am to 7pm, Sat: 11am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "304 Choa Chu Kang Ave 4 #01-663",
                "landmark": "Choa Chu Kang Branch",
                "latitude": 1.3845134,
                "longitude": 103.7431433,
                "postalCode": "680304",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "520 Lorong 6 Toa Payoh #02-52/53",
                "landmark": "Toa Payoh Central Branch",
                "latitude": 1.332701,
                "longitude": 103.8472004,
                "postalCode": "310520",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "53 Ang Mo Kio Avenue 3 #B1-32/33 AMK Hub (with Premier Banking centre)",
                "landmark": "Ang Mo Kio Central Branch",
                "latitude": 1.36960931741908,
                "longitude": 103.848513364791,
                "postalCode": "569933",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Closure of Ang Mo Kio Central Business Desk  Please be informed that the Business Desk at Ang Mo Kio Central branch will no longer be available from 1 October 2019. "
              },
              {
                "category": "Bank Branch",
                "address": "83 Marine Parade Central #01-576/578",
                "landmark": "Marine Parade Branch",
                "latitude": 1.3028954,
                "longitude": 103.9059678,
                "postalCode": "440083",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "90 Hougang Ave 10 #01-01 to 05 Hougang Mall (with Premier Banking centre)",
                "landmark": "Hougang Mall Branch",
                "latitude": 1.372861,
                "longitude": 103.893799,
                "postalCode": "538766",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "930 Yishun Ave 2 #B1-36 Northpoint City",
                "landmark": "Northpoint Branch",
                "latitude": 1.429713,
                "longitude": 103.835901,
                "postalCode": "769098",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "86/88 Serangoon Garden Way (with Premier Banking centre)",
                "landmark": "Serangoon Garden Branch",
                "latitude": 1.3644178,
                "longitude": 103.8649363,
                "postalCode": "555982",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "1 Tampines Central 5 #01-02 Tampines CPF Building",
                "landmark": "Tampines Branch",
                "latitude": 1.3531169,
                "longitude": 103.943659,
                "postalCode": "529508",
                "openingHours": "Mon-Sun: 11am to 7pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "277 Orchard Road,  orchardgateway, #01-16, #B1-12 & #B2-12 (with Premier Banking centre)",
                "landmark": "Orchardgateway Branch",
                "latitude": 1.300542,
                "longitude": 103.839192,
                "postalCode": "238858",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm , Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "170 Upper Bukit Timah Rd #01-01 Bukit Timah Shopping Centre",
                "landmark": "Bukit Timah Branch",
                "latitude": 1.3431448,
                "longitude": 103.7760788,
                "postalCode": "588179",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "1. Business Account opening service is available from Mon-Fri 2. Bukit Timah branch will cease operations from 4 January 2020 ."
              },
              {
                "category": "Bank Branch",
                "address": "211 Hougang St 21 #01-295",
                "landmark": "Hougang Branch",
                "latitude": 1.3596609,
                "longitude": 103.8876821,
                "postalCode": "530211",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "257 Bangkit Rd #01-51/55",
                "landmark": "Bukit Panjang Branch",
                "latitude": 1.3785138,
                "longitude": 103.7732147,
                "postalCode": "670257",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "303 Woodlands St 31 #01-159/161",
                "landmark": "Woodlands Branch",
                "latitude": 1.430731,
                "longitude": 103.7738886,
                "postalCode": "730303",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am , Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "3155 Commonwealth Avenue West #04-52 to 55 The Clementi Mall",
                "landmark": "Clementi Branch",
                "latitude": 1.31534,
                "longitude": 103.76447,
                "postalCode": "129588",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "460 North Bridge Road #01-00",
                "landmark": "North Branch",
                "latitude": 1.2982614,
                "longitude": 103.855756,
                "postalCode": "188734",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "502 Jurong West Ave 1 #01-821",
                "landmark": "Jurong West Branch",
                "latitude": 1.3504865,
                "longitude": 103.7181373,
                "postalCode": "640502",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "629 Ang Mo Kio Ave 4 #01-1006/1008/1010",
                "landmark": "Ang Mo Kio Branch",
                "latitude": 1.3801854,
                "longitude": 103.8404156,
                "postalCode": "560629",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "634 Bukit Batok Central #01-108",
                "landmark": "Bukit Batok Branch",
                "latitude": 1.3497297,
                "longitude": 103.7515247,
                "postalCode": "650634",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "No Business Account Opening Services"
              },
              {
                "category": "Bank Branch",
                "address": "65 Chulia St #01-00 OCBC Centre (with Premier Banking centre)",
                "landmark": "OCBC Centre Branch",
                "latitude": 1.285026,
                "longitude": 103.84907,
                "postalCode": "049513",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "70 Stamford Road #B1-43 Singapore Management University (Business Banking services are not available)",
                "landmark": "SMU FRANK Store",
                "latitude": 1.29666,
                "longitude": 103.85011,
                "postalCode": "178901",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & PH:Closed",
                "remark": "No Business Account Opening Services"
              },
              {
                "category": "Bank Branch",
                "address": "23 Serangoon Central #B2-28/29 (with Premier Banking centre)",
                "landmark": "NEX Branch",
                "latitude": 1.349995,
                "longitude": 103.8728728,
                "postalCode": "556083",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "827 Bukit Timah Road (with Premier Banking centre)",
                "landmark": "Sixth Avenue Branch",
                "latitude": 1.33161,
                "longitude": 103.79475,
                "postalCode": "279886",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "88 Bedok North St 4 #01-163",
                "landmark": "Bedok North Branch",
                "latitude": 1.3331407,
                "longitude": 103.9390281,
                "postalCode": "460088",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "2 Orchard Turn #B2-57 (with Premier Banking centre)",
                "landmark": "ION Orchard Branch",
                "latitude": 1.304288496,
                "longitude": 103.8320553,
                "postalCode": "238801",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "180 Kitchener Road #02-01/02",
                "landmark": "City Square Mall Branch",
                "latitude": 1.311625108,
                "longitude": 103.8566029,
                "postalCode": "208539",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm, Sat: 11.00am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "10 Marina Boulevard #01-04, Marina Bay Financial Centre Tower 2 (with Premier Banking centre)",
                "landmark": "Marina Bay Financial Centre Branch",
                "latitude": 1.27948,
                "longitude": 103.85407,
                "postalCode": "018983",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "No Business Account Opening Services"
              },
              {
                "category": "Bank Branch",
                "address": "(Business Loan Centre) Blk 302 Ubi Ave 1 #01-59/ 63 (Business Banking centre only)",
                "landmark": "Ubi Business Banking Centre",
                "latitude": 1.330223,
                "longitude": 103.900995,
                "postalCode": "400302",
                "openingHours": "Mon-Fri: 10.00am to 5.30pm, Saturdays, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "181 Upper Thomson Road (with Premier Banking centre)",
                "landmark": "Thomson Branch",
                "latitude": 1.35065,
                "longitude": 103.83563,
                "postalCode": "574331",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "1 Pasir Ris Central St 3 White Sands, #01-13",
                "landmark": "White Sands Branch",
                "latitude": 1.3724652,
                "longitude": 103.9496805,
                "postalCode": "518457",
                "openingHours": "Mon to Fri: 11am to 7pm, Sat: 11am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "60 Paya Lebar Road #01-45/46/52/53",
                "landmark": "Paya Lebar Square",
                "latitude": 1.319072,
                "longitude": 103.892618,
                "postalCode": "409051",
                "openingHours": "Mon to Fri: 11am to 7pm, Sat: 11am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "30 Sembawang Drive #02-05 Sun Plaza",
                "landmark": "Sun Plaza Branch",
                "latitude": 1.44842,
                "longitude": 103.81917,
                "postalCode": "757713",
                "openingHours": "Mon to Fri: 11am to 7pm, Sat: 11am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "3 Temasek Boulevard Suntec City Mall #02-411/412  (Near Tower 5)",
                "landmark": "Suntec City",
                "latitude": 1.29575,
                "longitude": 103.85888,
                "postalCode": "038983",
                "openingHours": "Mon to Fri: 11am to 7pm, Sat: 11am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "50 Nanyang Avenue Blk NS3-01-10 Academic Complex North Nanyang Technological University",
                "landmark": "Nanyang Technological University FRANK Store",
                "latitude": 1.344496,
                "longitude": 103.680163,
                "postalCode": "639798",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & Public Holidays:Closed",
                "remark": "No Business Account Opening Services"
              },
              {
                "category": "Bank Branch",
                "address": "1 Sengkang Square  #02-04 Compass One",
                "landmark": "Compass One Branch",
                "latitude": 1.392272,
                "longitude": 103.894775,
                "postalCode": "545078",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "83 Punggol Central  #01-13 Waterway Point",
                "landmark": "Waterway Point Branch",
                "latitude": 1.406667,
                "longitude": 103.901944,
                "postalCode": "828761",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "302 Tiong Bahru Road #01-125/126 Tiong Bahru Plaza",
                "landmark": "Tiong Bahru Plaza Branch",
                "latitude": 1.2864,
                "longitude": 103.8279,
                "postalCode": "168732",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "9 Bishan Place #02-08/09 Junction 8 Shopping Centre",
                "landmark": "Bishan Branch",
                "latitude": 1.3506356,
                "longitude": 103.8487439,
                "postalCode": "579837",
                "openingHours": "Mon - Fri: 11.00am to 7pm, Sat: 11.00am to 1,30pm , Sun & Public Holidays: Closed",
                "remark": "Business Account opening service is available from Mon-Fri"
              },
              {
                "category": "Bank Branch",
                "address": "2 College Avenue West Stephen Riady Centre University Town, #01-01 National University of Singapore",
                "landmark": "National University of Singapore FRANK Store",
                "latitude": 1.30457,
                "longitude": 103.77239,
                "postalCode": "138607",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & PH:Closed",
                "remark": "No Business Account Opening Services No Teller Counter Services"
              },
              {
                "category": "Bank Branch",
                "address": "101 Thomson Road #02-26 to 29 United Square",
                "landmark": "United Square Branch",
                "latitude": 1.3172,
                "longitude": 103.8436,
                "postalCode": "307591",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm, Sat: 11.00am to 1.30pm, Sundays and Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Bank Branch",
                "address": "1 Stadium Place  #01-66/67, Kallang Wave",
                "landmark": "Kallang Wave Premier Centre",
                "latitude": 1.303383,
                "longitude": 103.872927,
                "postalCode": "397628",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm, (Premier Teller Counter Service closes at 6.30pm), Sat: 11.00am to 3.00pm, Sun & Public Hlolidays: Closed",
                "remark": ""
              },
              {
                "category": "Bank Branch",
                "address": "80 Marine Parade Road #15-05 to 09 Parkway Parade",
                "landmark": "Parkway Parade Premier Centre",
                "latitude": 1.3019,
                "longitude": 103.905,
                "postalCode": "449269",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm, Sat: 11.00am to 1.30pm, Sun & Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Bank Branch",
                "address": "277 Orchard Road,  orchardgateway, #B1-12",
                "landmark": "Orchardgateway FRANK Store",
                "latitude": 1.300542,
                "longitude": 103.839192,
                "postalCode": "238858",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm , Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Business centre",
                "address": "520 Lorong 6 Toa Payoh #02-53",
                "landmark": "Toa Payoh Central Branch",
                "latitude": 1.33312,
                "longitude": 103.84752,
                "postalCode": "310520",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm",
                "remark": ""
              },
              {
                "category": "Business centre",
                "address": "65 Chulia Street #01-01 OCBC Centre",
                "landmark": "OCBC Centre Branch",
                "latitude": 1.28505,
                "longitude": 103.84908,
                "postalCode": "049513",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am",
                "remark": ""
              },
              {
                "category": "Business centre",
                "address": "Blk 302 Ubi Ave 1 #01-59/63",
                "landmark": "Ubi Business Banking Centre",
                "latitude": 1.33022,
                "longitude": 103.90099,
                "postalCode": "400302",
                "openingHours": "Mon-Fri: 10.00am to 5.30pm",
                "remark": ""
              },
              {
                "category": "Frank store",
                "address": "70 Stamford Road #B1-43 Singapore Management University (Li Ka Shing Library)",
                "landmark": "Singapore Management University FRANK Store",
                "latitude": 1.29666,
                "longitude": 103.85011,
                "postalCode": "178901",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & PH:Closed",
                "remark": ""
              },
              {
                "category": "Frank store",
                "address": "277 Orchard Road, orchardgateway, #B1-12",
                "landmark": "Orchardgateway FRANK Store",
                "latitude": 1.300542,
                "longitude": 103.839192,
                "postalCode": "238858",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Frank store",
                "address": "50 Nanyang Avenue Blk NS3-01-10 Academic Complex North Nanyang Technological University",
                "landmark": "Nanyang Technological University FRANK Store",
                "latitude": 1.344496,
                "longitude": 103.680163,
                "postalCode": "639798",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & PH:Closed",
                "remark": ""
              },
              {
                "category": "Frank store",
                "address": "2 College Avenue West Stephen Riady Centre University Town, #01-01 National University of Singapore",
                "landmark": "National University of Singapore FRANK Store",
                "latitude": 1.30457,
                "longitude": 103.77239,
                "postalCode": "138607",
                "openingHours": "Mon - Fri:9.00am - 4.30pm, Sat, Sun & PH:Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "53 Ang Mo Kio Avenue 3 #B1-32/33",
                "landmark": "Ang Mo Kio Central",
                "latitude": 1.36949,
                "longitude": 103.84843,
                "postalCode": "569933",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "80 Marine Parade Road #15-05 to 09 Parkway Parade",
                "landmark": "Parkway Parade",
                "latitude": 1.3019,
                "longitude": 103.905,
                "postalCode": "449269",
                "openingHours": "Mon-Fri: 11.00am to 7.00pm, Sat: 11.00am to 1.30pm, Sun & PH: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "20/20A Lorong Mambong",
                "landmark": "Holland Village",
                "latitude": 1.31142307,
                "longitude": 103.79509881,
                "postalCode": "277679",
                "openingHours": "Mon-Fri: 11am to 7pm, Sat: 11am to 1:30pm, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "90 Hougang Avenue 10 #01-01/02/03/04/05",
                "landmark": "Hougang Mall",
                "latitude": 1.37208,
                "longitude": 103.89366,
                "postalCode": "538766",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "2 Orchard Turn #B2-57",
                "landmark": "ION Orchard",
                "latitude": 1.30473,
                "longitude": 103.83147,
                "postalCode": "238801",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "10 Marina Boulevard #01-04",
                "landmark": "Marina Bay Financial Centre",
                "latitude": 1.27943,
                "longitude": 103.85416,
                "postalCode": "018983",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "23 Serangoon Central #B2-28/29",
                "landmark": "NEX",
                "latitude": 1.35075,
                "longitude": 103.8728,
                "postalCode": "556083",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "65 Chulia Street Mezzanine Floor OCBC Centre",
                "landmark": "OCBC Centre",
                "latitude": 1.28505,
                "longitude": 103.84908,
                "postalCode": "049513",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "277 Orchard Road,  orchardgateway, #01-16 & #B2-12",
                "landmark": "Orchardgateway",
                "latitude": 1.300542,
                "longitude": 103.839192,
                "postalCode": "238858",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "86/88 Serangoon Garden Way Level 2",
                "landmark": "Serangoon Garden",
                "latitude": 1.36438,
                "longitude": 103.86493,
                "postalCode": "555982",
                "openingHours": "Mon-Fri: 9am to 4:30pm, Sat: 9am to 11.30am, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "827 Bukit Timah Road",
                "landmark": "Sixth Avenue",
                "latitude": 1.33154,
                "longitude": 103.7947,
                "postalCode": "279886",
                "openingHours": "Mon-Fri: 9.00am to 4.30pm, Sat: 9.00am to 11.30am, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "181 Upper Thomson Road",
                "landmark": "Thomson",
                "latitude": 1.35065,
                "longitude": 103.83563,
                "postalCode": "574331",
                "openingHours": "Mon-Fri: 9am to 4:30pm, Sat: 9am to 11.30am, Sun: Closed",
                "remark": ""
              },
              {
                "category": "Premier centre",
                "address": "1 Stadium Place #01-66/67, Kallang Wave",
                "landmark": "Kallang Wave",
                "latitude": 1.303383,
                "longitude": 103.872927,
                "postalCode": "397628",
                "openingHours": "Mon - Fri: 11.00am to 7pm, (Premier Teller Counter Service closes at 6.30pm), Sat: 11.00am to 3pm, Sun & PH:Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "1 Jurong West Central 2 #B1-31/32/33/46 Jurong Point Shopping Centre",
                "landmark": "Jurong Point Branch",
                "latitude": 1.3395077,
                "longitude": 103.7067438,
                "postalCode": "648886",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "1 Maritime Square #02-99/100 HarbourFront Centre",
                "landmark": "HarbourFront Branch",
                "latitude": 1.263904,
                "longitude": 103.8201912,
                "postalCode": "099253",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "1 Woodlands Square #01-16 Causeway Point",
                "landmark": "Causeway Point Branch",
                "latitude": 1.4360915,
                "longitude": 103.7859058,
                "postalCode": "738099",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "50 Jurong Gateway Road #B1-18 Jem",
                "landmark": "Jurong East Branch",
                "latitude": 1.333066,
                "longitude": 103.743657,
                "postalCode": "608549",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "204 Bedok North St 1 #01-403/405/407",
                "landmark": "Bedok Branch",
                "latitude": 1.3263064,
                "longitude": 103.930105,
                "postalCode": "460204",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "304 Choa Chu Kang Ave 4 #01-663",
                "landmark": "Choa Chu Kang Branch",
                "latitude": 1.3845134,
                "longitude": 103.7431433,
                "postalCode": "680304",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "520 Lorong 6 Toa Payoh #02-52/53",
                "landmark": "Toa Payoh Central Branch",
                "latitude": 1.332701,
                "longitude": 103.8472004,
                "postalCode": "310520",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "53 Ang Mo Kio Avenue 3 #B1-32/33 AMK Hub",
                "landmark": "Ang Mo Kio Central Branch",
                "latitude": 1.369609317,
                "longitude": 103.8485134,
                "postalCode": "569933",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "83 Marine Parade Central #01-576/578",
                "landmark": "Marine Parade Branch",
                "latitude": 1.3028954,
                "longitude": 103.9059678,
                "postalCode": "440083",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "90 Hougang Ave 10 #01-01 to 05 Hougang Mall",
                "landmark": "Hougang Mall Branch",
                "latitude": 1.372861,
                "longitude": 103.893799,
                "postalCode": "538766",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "930 Yishun Ave 2 #B1-36 Northpoint Shopping Centre",
                "landmark": "Northpoint Branch",
                "latitude": 1.429713,
                "longitude": 103.835901,
                "postalCode": "769098",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "2 Orchard Turn #B2-57 (with Premier Banking Centre)",
                "landmark": "ION Orchard Branch",
                "latitude": 1.304288496,
                "longitude": 103.8320553,
                "postalCode": "238801",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "23 Serangoon Central #B2-28/29",
                "landmark": "nex Branch",
                "latitude": 1.349995,
                "longitude": 103.8728728,
                "postalCode": "556083",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "3155 Commonwealth Avenue West #04-52 to 55 The Clementi Mall",
                "landmark": "Clementi Branch",
                "latitude": 1.31534,
                "longitude": 103.76447,
                "postalCode": "129588",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "1 Tampines Central 5 #01-02 Tampines CPF Building",
                "landmark": "Tampines Branch",
                "latitude": 1.3531169,
                "longitude": 103.943659,
                "postalCode": "529508",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "277 Orchard Road, orchardgateway, #01-16, #B1-12 & #B2-12 (with Premier Banking centre)",
                "landmark": "Orchardgateway Branch",
                "latitude": 1.300542,
                "longitude": 103.839192,
                "postalCode": "238858",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "83 Punggol Central #01-13 Waterway Point",
                "landmark": "Waterway Point Branch",
                "latitude": 1.406667,
                "longitude": 103.901944,
                "postalCode": "828761",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "1 Sengkang Square #02-04 Compass One",
                "landmark": "Compass One Branch",
                "latitude": 1.392272,
                "longitude": 103.894775,
                "postalCode": "545078",
                "openingHours": "Mon - Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Sunday branch",
                "address": "302 Tiong Bahru Road #01-125/126 Tiong Bahru Plaza",
                "landmark": "Tiong Bahru Plaza Branch",
                "latitude": 1.2864,
                "longitude": 103.8279,
                "postalCode": "168732",
                "openingHours": "Mon-Sun: 11.00am to 7.00pm, Public Holidays: Closed",
                "remark": ""
              },
              {
                "category": "Trade centre",
                "address": "31 Tampines Ave 4 #02-00 OCBC Tampines Centre 2",
                "landmark": "Tampines",
                "latitude": 1.351997537,
                "longitude": 103.942278,
                "postalCode": "529680",
                "openingHours": "Mon - Fri : 9:00am to 6:00pm",
                "remark": ""
              },
              {
                "category": "Trade centre",
                "address": "OCBC Centre South 18 Church Street #04-00 OCBC Centre South",
                "landmark": "Central",
                "latitude": 1.2847,
                "longitude": 103.8488,
                "postalCode": "049479",
                "openingHours": "Mon - Fri : 9:30am to 5:00pm",
                "remark": ""
              },
              {
                "category": "Trade centre",
                "address": "Blk 302, Ubi Ave 1 #01-59/63",
                "landmark": "Ubi",
                "latitude": 1.330223,
                "longitude": 103.900995,
                "postalCode": "400302",
                "openingHours": "Mon - Fri : 10:00am to 4:30pm",
                "remark": ""
              }];

    async function getAllBranches(): Promise<void> {
        const response = await fetch("http://localhost:5050/allBranches");
        const result = await response.json();

        setBranches(result.branchesAndCentresList);
    }

    const [selectedBranch, setSelectedBranch] = useState<object>({});
    const [search, setSearch] = useState<string>("");
    const [nearest, setNearest] = useState(false);

    useEffect(() => {
        setBranches(data);
    }, []);

    useEffect(() => {
        const filteredData = data.filter((branch: object) => branch.landmark.toLowerCase().includes(search.toLowerCase()));
        
        setBranches(filteredData);
    }, [search]);

    return (
        <>
            <div className="w-full h-screen flex flex-col">
                <Navbar />
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-1/5 h-full flex flex-col overflow-y-scroll">
                        <BranchSearch search={search} setSearch={setSearch} />
                        <div className="flex items-center p-4 gap-4">
                            <Checkbox checked={nearest} onCheckedChange={() => setNearest(!nearest)} />
                            <h1>Nearest Branch</h1>
                        </div>
                        {branches.map((branch: object, index: number) => {
                            return (
                                <BranchButton key={index} branch={branch} setSelectedBranch={setSelectedBranch} />
                            );
                        })}
                    </div>
                    <MapContainer className="w-4/5 h-full z-0" center={[1.3521, 103.8198]} zoom={13} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <BranchMarkers branches={branches} selectedBranch={selectedBranch} nearest={nearest} />
                    </MapContainer>
                </div>
            </div>
        </>
    );
}

export default Branches;
