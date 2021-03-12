/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useCallback } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input, Select } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import fetch from 'isomorphic-fetch';
import { utils } from "ethers";
import PinataDropzone from "../components/PinataDropzone"

const { Option } = Select;

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  padding: 20
} as const;

type MintProps = {
  address, 
  getFromIPFS, 
  tx, 
  readContracts, 
  writeContracts 
}

const Mint = ({
  address, 
  getFromIPFS, 
  tx, 
  readContracts, 
  writeContracts
}: MintProps) => {




  return (
    <>
     <PinataDropzone/>
    </>
  );
}

export default Mint;
