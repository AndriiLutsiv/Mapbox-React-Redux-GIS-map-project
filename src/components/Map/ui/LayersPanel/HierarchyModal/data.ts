export const data = [
    {
      type: "point",
      props: {
        uuid: "62310872-5b0f-4ab3-8c81-cb1c10cfbc8a",
        uprn: 10024359953,
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "c4a96bce-0281-4947-a0c4-836036e84aa4",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "6f9438b2-d67a-4702-a228-1ea72de7f712",
        distance: 5.000000000071441,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "c4a96bce-0281-4947-a0c4-836036e84aa4",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
        },
        subduct_type: "bundle_3x3",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "700d20ee-a24a-4407-b332-5747997dfa86",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "c4a96bce-0281-4947-a0c4-836036e84aa4",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "ed8cf10e-c27f-4aea-9b46-a1fc0df2e159",
        },
        node_type: "DN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
          },
        ],
        connected_to: [
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "413e2513-18a1-49d9-b0a8-dc4503e1213f",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "d7bb4c0f-eb6c-4b11-ae4f-a6a7a95c8030",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "b2269acc-3953-4f4b-99ec-b4adfb3f1f66",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "62310872-5b0f-4ab3-8c81-cb1c10cfbc8a",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "893714ce-5fd4-4d5a-9145-36c2891167d7",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "ca39057a-d005-457b-a9a3-f307fa664860",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "1245b3a0-1466-4367-b1b5-f8ecb2045241",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "16f1aa92-ee86-424e-a2a3-79f4239fe32a",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "5a08d62b-80ba-4b78-9fb0-aaeb310cf04e",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "7fd456a7-fb0d-4f04-ab86-1040e4976dd2",
        distance: 0.14090941383072506,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
        },
        tube_type: "mm6",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "145758db-4904-47e3-8b24-5e1de47b98a0",
        },
        subduct_parent: {
          layer_type: "subduct",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "30c3107a-6685-49b3-9f0a-619dcfebad04",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "a4ac7f80-5fb4-4cd3-9c7a-928b1714580f",
        },
        node_type: "DYN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
          },
        ],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "1c917798-88a9-470c-bf4f-68496d7cf523",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "c4a96bce-0281-4947-a0c4-836036e84aa4",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "db831f2d-3eea-430a-ac00-5479712384e0",
        distance: 0.6161430365451501,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "a06a3262-2755-4fab-8c33-55b75dcfa9be",
        },
        tube_type: "mm11",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "ce093b64-1a1f-454a-b09e-1cedb2130346",
        },
        subduct_parent: {
          layer_type: "subduct",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "5122ca5a-4901-4236-abb6-ef243d4dbb08",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "0cdde904-bb1e-4a6c-984d-2359d5ff2c22",
        },
        node_type: "DAN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "a06a3262-2755-4fab-8c33-55b75dcfa9be",
          },
        ],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "ce1b318d-879d-457c-8c20-523ae419902e",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "3d69ccd0-ce15-4cf2-9d36-4cc2a7b72d63",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "8daf9d40-d79f-41df-a35f-8d3608c74a98",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "e1590417-98d3-4104-8ce8-d7115dca2e07",
        distance: 13.108096625079657,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "a06a3262-2755-4fab-8c33-55b75dcfa9be",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "8d33b52b-4550-4bc4-8ccd-496fe57b81e5",
        },
        subduct_type: "bundle_3x3",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "2c142485-34c5-447f-a17d-e5d611dbdbf5",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "a06a3262-2755-4fab-8c33-55b75dcfa9be",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "5b25a107-9c51-4137-90bd-dd6b0d902b19",
        },
        node_type: "ZN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "8d33b52b-4550-4bc4-8ccd-496fe57b81e5",
          },
        ],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "7200553e-239b-443c-b9b9-17a3dc176985",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "d123494a-8ad6-4cb8-ba15-cd708a6e9caf",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fac7f32f-223a-4748-9f7c-9372b04340b6",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "83527d55-eea5-430b-bed2-41724caca12d",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "58a0b717-3e76-46e2-8cff-0a34a5353f2d",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "aedb98dd-b4a0-4266-b479-e3a91e5eacc6",
        distance: 29.463305971441077,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "8d33b52b-4550-4bc4-8ccd-496fe57b81e5",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
        },
        subduct_type: "bundle_3x3",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "6b2c1b51-d3c7-4e5d-aa7c-7640e475d9a4",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "8d33b52b-4550-4bc4-8ccd-496fe57b81e5",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "54e1d84f-43c2-4874-a7fc-f2334ce99ed2",
        },
        node_type: "AN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fd653fc7-0968-4067-8bbd-162b82c9c734",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fd653fc7-0968-4067-8bbd-162b82c9c734",
          },
        ],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "a06a3262-2755-4fab-8c33-55b75dcfa9be",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "59b63ba8-66ae-40d2-82f0-6cf6e04dce7c",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fd7ca717-66ab-466a-a749-013f625d4119",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fd7ca717-66ab-466a-a749-013f625d4119",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "fd7ca717-66ab-466a-a749-013f625d4119",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "d3cbeffc-bedc-406e-a982-219b5b87ed37",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "d4e51a5c-8fce-4bef-b961-9c9d9cee2f41",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "0aa2cc19-b87c-40cd-a931-c1cdf8ea184c",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "e77abe8d-1fea-43f0-9362-43faf7099bef",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "1763d112-6033-4757-a1ba-beb900fbe3c1",
          },
          {
            layer_type: "properties",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "80179785-ff2c-4353-9f4d-1a721f8ae590",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "97650eb6-1780-4011-b621-decf12925a41",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "a272182c-9400-4813-aaba-93054d181d4b",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "49b6d266-a932-4ece-a1a8-1b64cf52ddae",
          },
        ],
      },
    },
    {
      type: "line",
      props: {
        uuid: "9b3eaa20-8b00-446d-af48-5714a8af42bb",
        distance: 1.1398122473456676,
        from_: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
        },
        to: {
          layer_type: "nodes",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "616746a2-0fea-4681-a2ca-0f63fe77b2ae",
        },
        subduct_type: "bundle_3x3",
        infra_parent: {
          layer_type: "infra_line",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "a662c08c-01ab-4279-a3b0-41222e6a8631",
        },
      },
    },
    {
      type: "point",
      props: {
        uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "8343cdbd-9755-4c89-82f0-2128cd39eeec",
        },
        node_type: "ZAN",
        connected_from: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "616746a2-0fea-4681-a2ca-0f63fe77b2ae",
          },
        ],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "8d33b52b-4550-4bc4-8ccd-496fe57b81e5",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "d8efe0c6-5a14-4819-a9ec-31b4c530e7fb",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "68476548-4c0a-4020-836a-7dcbc3c7b46a",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "6c5a95a7-0a53-4b35-aa7c-bdd19f3fac8e",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "3d537a90-8184-43c0-b989-33e9685d2cfa",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "93d28e79-7eaa-41ac-8d3c-8ccffcdf1c2c",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "ac94171a-cff9-4bec-9a74-fd4a637c0af8",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "aec3d66a-264d-4319-8986-a8e2153d95a1",
          },
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "332e4903-3529-4bb6-8fc4-70637a5b06f1",
          },
        ],
      },
    },
    { type: "line",
    props: {
      uuid: "9b3eaa20-8b00-446d-af48-5714a8af42bb_second",
      distance: 1.1398122473456676,
      from_: {
        layer_type: "nodes",
        project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
        uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
      },
      to: {
        layer_type: "nodes",
        project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
        uuid: "616746a2-0fea-4681-a2ca-0f63fe77b2ae",
      },
      subduct_type: "bundle_3x3",
      infra_parent: {
        layer_type: "infra_line",
        project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
        uuid: "a662c08c-01ab-4279-a3b0-41222e6a8631",
      },
    }, },
    {
      type: "point",
      props: {
        uuid: "616746a2-0fea-4681-a2ca-0f63fe77b2ae",
        infra_parent: {
          layer_type: "infra_point",
          project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
          uuid: "59400524-a4a7-443f-a680-a8bd66768e9f",
        },
        node_type: "TE",
        connected_from: [],
        connected_to: [
          {
            layer_type: "nodes",
            project_uuid: "5ef9f824-484b-4b52-b7b8-a1842c0513eb",
            uuid: "7a340c55-6779-4057-bb58-dc5714359e7d",
          },
        ],
      },
    },
  ];
  