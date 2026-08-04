export interface Upazila {
  name: string;
  postalCodes?: string[];
}

export interface District {
  name: string;
  upazilas: Upazila[];
}

export interface Division {
  name: string;
  districts: District[];
}

export const bdAddress: Division[] = [
  {
    name: "Chattogram",
    districts: [
      {
        name: "Chattogram",
        upazilas: [
          {
            name: "Sitakunda",
            postalCodes: ["4310", "4314", "4320"],
          },
          {
            name: "Pahartali",
            postalCodes: ["4202"],
          },
          {
            name: "Halishahar",
            postalCodes: ["4216"],
          },
          {
            name: "Panchlaish",
            postalCodes: ["4203"],
          },
          {
            name: "Kotwali",
            postalCodes: ["4000"],
          },
          {
            name: "Patenga",
            postalCodes: ["4204"],
          },
        ],
      },

      {
        name: "Cox's Bazar",
        upazilas: [
          {
            name: "Cox's Bazar Sadar",
            postalCodes: ["4700"],
          },
          {
            name: "Teknaf",
            postalCodes: ["4760"],
          },
          {
            name: "Ukhia",
            postalCodes: ["4750"],
          },
        ],
      },

      {
        name: "Rangamati",
        upazilas: [
          {
            name: "Rangamati Sadar",
            postalCodes: ["4500"],
          },
          {
            name: "Baghaichhari",
            postalCodes: ["4590"],
          },
        ],
      },

      {
        name: "Bandarban",
        upazilas: [
          {
            name: "Bandarban Sadar",
            postalCodes: ["4600"],
          },
        ],
      },
    ],
  },

  {
    name: "Dhaka",
    districts: [
      {
        name: "Dhaka",
        upazilas: [
          {
            name: "Dhanmondi",
            postalCodes: ["1205"],
          },
          {
            name: "Mirpur",
            postalCodes: ["1216"],
          },
          {
            name: "Uttara",
            postalCodes: ["1230"],
          },
          {
            name: "Mohammadpur",
            postalCodes: ["1207"],
          },
          {
            name: "Gulshan",
            postalCodes: ["1212"],
          },
          {
            name: "Badda",
            postalCodes: ["1212"],
          },
        ],
      },

      {
        name: "Gazipur",
        upazilas: [
          {
            name: "Gazipur Sadar",
            postalCodes: ["1700"],
          },
          {
            name: "Kaliakair",
            postalCodes: ["1750"],
          },
        ],
      },

      {
        name: "Narayanganj",
        upazilas: [
          {
            name: "Narayanganj Sadar",
            postalCodes: ["1400"],
          },
          {
            name: "Rupganj",
            postalCodes: ["1460"],
          },
        ],
      },

    ],
  },
    {
    name: "Rajshahi",
    districts: [
      {
        name: "Rajshahi",
        upazilas: [
          { name: "Rajshahi Sadar", postalCodes: ["6000"] },
          { name: "Godagari", postalCodes: ["6290"] },
          { name: "Paba", postalCodes: ["6260"] },
        ],
      },
      {
        name: "Bogura",
        upazilas: [
          { name: "Bogura Sadar", postalCodes: ["5800"] },
          { name: "Sherpur", postalCodes: ["5840"] },
          { name: "Shibganj", postalCodes: ["5810"] },
        ],
      },
      {
        name: "Pabna",
        upazilas: [
          { name: "Pabna Sadar", postalCodes: ["6600"] },
          { name: "Ishwardi", postalCodes: ["6620"] },
        ],
      },
    ],
  },

  {
    name: "Khulna",
    districts: [
      {
        name: "Khulna",
        upazilas: [
          { name: "Khulna Sadar", postalCodes: ["9000"] },
          { name: "Dumuria", postalCodes: ["9250"] },
          { name: "Batiaghata", postalCodes: ["9260"] },
        ],
      },
      {
        name: "Jashore",
        upazilas: [
          { name: "Jashore Sadar", postalCodes: ["7400"] },
          { name: "Benapole", postalCodes: ["7431"] },
        ],
      },
      {
        name: "Satkhira",
        upazilas: [
          { name: "Satkhira Sadar", postalCodes: ["9400"] },
          { name: "Shyamnagar", postalCodes: ["9450"] },
        ],
      },
    ],
  },

  {
    name: "Barishal",
    districts: [
      {
        name: "Barishal",
        upazilas: [
          { name: "Barishal Sadar", postalCodes: ["8200"] },
          { name: "Babuganj", postalCodes: ["8210"] },
        ],
      },
      {
        name: "Patuakhali",
        upazilas: [
          { name: "Patuakhali Sadar", postalCodes: ["8600"] },
          { name: "Kalapara", postalCodes: ["8650"] },
        ],
      },
    ],
  },
    {
    name: "Sylhet",
    districts: [
      {
        name: "Sylhet",
        upazilas: [
          { name: "Sylhet Sadar", postalCodes: ["3100"] },
          { name: "Beanibazar", postalCodes: ["3170"] },
          { name: "Golapganj", postalCodes: ["3160"] },
        ],
      },
      {
        name: "Moulvibazar",
        upazilas: [
          { name: "Moulvibazar Sadar", postalCodes: ["3200"] },
          { name: "Sreemangal", postalCodes: ["3210"] },
        ],
      },
      {
        name: "Habiganj",
        upazilas: [
          { name: "Habiganj Sadar", postalCodes: ["3300"] },
          { name: "Madhabpur", postalCodes: ["3331"] },
        ],
      },
    ],
  },

  {
    name: "Rangpur",
    districts: [
      {
        name: "Rangpur",
        upazilas: [
          { name: "Rangpur Sadar", postalCodes: ["5400"] },
          { name: "Badarganj", postalCodes: ["5430"] },
          { name: "Mithapukur", postalCodes: ["5460"] },
        ],
      },
      {
        name: "Dinajpur",
        upazilas: [
          { name: "Dinajpur Sadar", postalCodes: ["5200"] },
          { name: "Birampur", postalCodes: ["5266"] },
        ],
      },
      {
        name: "Kurigram",
        upazilas: [
          { name: "Kurigram Sadar", postalCodes: ["5600"] },
          { name: "Ulipur", postalCodes: ["5620"] },
        ],
      },
    ],
  },

  {
    name: "Mymensingh",
    districts: [
      {
        name: "Mymensingh",
        upazilas: [
          { name: "Mymensingh Sadar", postalCodes: ["2200"] },
          { name: "Trishal", postalCodes: ["2220"] },
          { name: "Muktagacha", postalCodes: ["2210"] },
        ],
      },
      {
        name: "Jamalpur",
        upazilas: [
          { name: "Jamalpur Sadar", postalCodes: ["2000"] },
          { name: "Melandah", postalCodes: ["2011"] },
        ],
      },
      {
        name: "Netrokona",
        upazilas: [
          { name: "Netrokona Sadar", postalCodes: ["2400"] },
          { name: "Madan", postalCodes: ["2490"] },
        ],
      },
    ],
  },
];

export function getDivisions() {
  return bdAddress;
}

export function getDistricts(divisionName: string) {
  return (
    bdAddress.find((d) => d.name === divisionName)?.districts || []
  );
}

export function getUpazilas(
  divisionName: string,
  districtName: string
) {
  return (
    bdAddress
      .find((d) => d.name === divisionName)
      ?.districts.find((d) => d.name === districtName)
      ?.upazilas || []
  );
}

export function getPostalCodes(
  divisionName: string,
  districtName: string,
  upazilaName: string
) {
  return (
    bdAddress
      .find((d) => d.name === divisionName)
      ?.districts.find((d) => d.name === districtName)
      ?.upazilas.find((u) => u.name === upazilaName)
      ?.postalCodes || []
  );
}
