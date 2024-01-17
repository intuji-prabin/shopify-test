export type CategoryDataType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  subCategory: {
    id: string;
    name: string;
    childCategory: {
      id: string;
      name: string;
    }[];
  }[];
};

export const CategoryData: CategoryDataType[] = [
  {
    id: '1',
    name: 'machines',
    description:
      'MIG welding is a popular choice for its versatility and convenience. Our collection of MIG welders offers a range of power outputs and features to suit different metal types and thicknesses.',
    imageUrl: 'Category-Image.png',
    subCategory: [
      {
        id: '1-2',
        name: 'Welders',
        childCategory: [
          {id: '1-2-1', name: 'Mig Welders'},
          {id: '1-2-2', name: 'TIG Welders'},
          {id: '1-2-3', name: 'Stick Welders'},
          {id: '1-2-4', name: 'Multi-Purpose Welders'},
        ],
      },
      {
        id: '1-3',
        name: 'POWER PACKS',
        childCategory: [{id: '1-3-1', name: 'Mig Welders'}],
      },
      {
        id: '1-4',
        name: 'PLASMA CUTTING',
        childCategory: [{id: '1-4-1', name: 'Mig Welders'}],
      },
      {
        id: '1-5',
        name: 'GAS CUTTING',
        childCategory: [{id: '1-5-1', name: 'Mig Welders'}],
      },
      {
        id: '1-6',
        name: 'WIRE FEEDERS',
        childCategory: [{id: '1-6-1', name: 'Mig Welders'}],
      },
      {
        id: '1-7',
        name: 'CNC & AUTOMATION',
        childCategory: [{id: '1-7-1', name: 'Mig Welders'}],
      },
    ],
  },
  {
    id: '2',
    name: 'gas equipment',
    description:
      'MIG welding is a popular choice for its versatility and convenience. Our collection of MIG welders offers a range of power outputs and features to suit different metal types and thicknesses.',
    imageUrl: 'Category-Image.png',
    subCategory: [
      {
        id: '2-2',
        name: 'Welders',
        childCategory: [
          {id: '2-2-1', name: 'Mig Welders'},
          {id: '2-2-2', name: 'Mig Welders'},
        ],
      },
      {
        id: '2-3',
        name: 'POWER PACKS',
        childCategory: [{id: '2-3-1', name: 'Mig Welders'}],
      },
      {
        id: '2-4',
        name: 'PLASMA CUTTING',
        childCategory: [{id: '2-4-1', name: 'Mig Welders'}],
      },
      {
        id: '2-5',
        name: 'GAS CUTTING',
        childCategory: [{id: '2-5-1', name: 'Mig Welders'}],
      },
      {
        id: '2-6',
        name: 'WIRE FEEDERS',
        childCategory: [{id: '2-6-1', name: 'Mig Welders'}],
      },
    ],
  },
  {
    id: '3',
    name: 'FILLER METALS',
    description:
      'MIG welding is a popular choice for its versatility and convenience. Our collection of MIG welders offers a range of power outputs and features to suit different metal types and thicknesses.',
    imageUrl: 'Category-Image.png',
    subCategory: [
      {
        id: '3-2',
        name: 'Welders',
        childCategory: [
          {id: '3-2-1', name: 'Mig Welders'},
          {id: '3-2-2', name: 'Mig Welders'},
        ],
      },
      {
        id: '3-3',
        name: 'POWER PACKS',
        childCategory: [{id: '3-3-1', name: 'Mig Welders'}],
      },
      {
        id: '3-4',
        name: 'PLASMA CUTTING',
        childCategory: [{id: '3-4-1', name: 'Mig Welders'}],
      },
      {
        id: '3-5',
        name: 'GAS CUTTING',
        childCategory: [{id: '3-5-1', name: 'Mig Welders'}],
      },
      {
        id: '3-6',
        name: 'WIRE FEEDERS',
        childCategory: [{id: '3-6-1', name: 'Mig Welders'}],
      },
    ],
  },
  {
    id: '4',
    name: 'SAFETY',
    description:
      'MIG welding is a popular choice for its versatility and convenience. Our collection of MIG welders offers a range of power outputs and features to suit different metal types and thicknesses.',
    imageUrl: 'Category-Image.png',
    subCategory: [
      {
        id: '4-2',
        name: 'Welders',
        childCategory: [
          {id: '4-2-1', name: 'Mig Welders'},
          {id: '4-2-2', name: 'Mig Welders'},
        ],
      },
      {
        id: '4-3',
        name: 'POWER PACKS',
        childCategory: [{id: '4-3-1', name: 'Mig Welders'}],
      },
      {
        id: '4-4',
        name: 'PLASMA CUTTING',
        childCategory: [{id: '4-4-1', name: 'Mig Welders'}],
      },
      {
        id: '4-5',
        name: 'GAS CUTTING',
        childCategory: [{id: '4-5-1', name: 'Mig Welders'}],
      },
      {
        id: '4-6',
        name: 'WIRE FEEDERS',
        childCategory: [{id: '4-6-1', name: 'Mig Welders'}],
      },
    ],
  },
];
