type InputType = {
  name: string;
  value: string;
  label: string;
};

type CheckboxFormDataType = {
  title: string;
  input: InputType[];
}[];

export const CheckboxInputData: CheckboxFormDataType = [
  {
    title: 'Expertise Level',
    input: [
      {
        name: 'expertise-level',
        value: 'entry-level-mig-welders',
        label: 'Entry Level Mig Welders',
      },
      {
        name: 'expertise-level',
        value: 'professional-mig-welders',
        label: 'Professional Mig Welders',
      },
      {
        name: 'expertise-level',
        value: 'heavy-industrial-mig-welders',
        label: 'Heavy Industrial Mig Welders',
      },
      {
        name: 'expertise-level',
        value: 'mig-and-synergic-pulsed-mig-systems',
        label: 'Mig and Synergic Pulsed Mig Systems',
      },
      {
        name: 'expertise-level',
        value: 'multi-process-mig-welders',
        label: 'Multi Process Mig Welders',
      },
    ],
  },
  {
    title: 'Brand',
    input: [
      {
        name: 'brand',
        value: '3m',
        label: '3M',
      },
      {
        name: 'brand',
        value: 'annovi-reverberi',
        label: 'Annovi Reverberi',
      },
      {
        name: 'brand',
        value: 'bostitch',
        label: 'Bostitch',
      },
      {
        name: 'brand',
        value: 'comet-pump',
        label: 'Comet Pump',
      },
      {
        name: 'brand',
        value: 'crescent',
        label: 'Crescent',
      },
      {
        name: 'brand',
        value: 'dewalt',
        label: 'Dewalt',
      },
      {
        name: 'brand',
        value: 'dremel',
        label: 'Dremel',
      },
    ],
  },
  {
    title: 'Material',
    input: [
      {name: 'material', value: 'alloy-steel', label: 'Alloy Steel'},
      {name: 'material', value: 'bi-metal', label: 'Bi-Metal'},
      {name: 'material', value: 'ferrous-metal', label: 'Ferrous Metal'},
      {name: 'material', value: 'ldpe', label: 'LDPE'},
      {name: 'material', value: 'polyster', label: 'Polyster'},
    ],
  },
  {
    title: 'Power Source',
    input: [
      {name: 'power-source', value: 'cordless', label: 'Cordless'},
      {
        name: 'power-source',
        value: 'electric-corded',
        label: 'Electric Corded',
      },
      {name: 'power-source', value: 'gas-engine', label: 'Gas Engine'},
      {name: 'power-source', value: 'hand', label: 'Hand'},
      {name: 'power-source', value: 'pneumatic', label: 'Pneumatic'},
    ],
  },
];

export const RadioInputData: InputType[] = [
  {name: 'warranty', value: '1-year', label: '1 Year'},
  {name: 'warranty', value: '2-years', label: '2 Years'},
  {name: 'warranty', value: '3-years', label: '3 Years'},
  {name: 'warranty', value: '5-years', label: '5 Years'},
  {name: 'warranty', value: '7-years', label: '7 Years'},
  {name: 'warranty', value: 'lifetime', label: 'Lifetime'},
  {name: 'warranty', value: 'limited-lifetime', label: 'Limited Lifetime'},
  {name: 'warranty', value: 'no', label: 'No'},
  {
    name: 'warranty',
    value: 'product-defects-only',
    label: 'Product Defects Only',
  },
];
