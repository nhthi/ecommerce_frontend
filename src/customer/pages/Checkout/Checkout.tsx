import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { Add } from "@mui/icons-material";
import PricingCart from "../Cart/PricingCart";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  p: 4,
};

const paymentGatewayList = [
  {
    value: "RAZORPAY",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyMecjLsgZ2mcCoyMxUbiA-kjY_Ek9dP-LEPguKylP6XKFm47R_cNNEakk7XTFCbbSQw&usqp=CAU",
    label: "",
  },
  {
    value: "STRIPE",
    image: "https://vikwp.com/images/plugins/stripe.png",
    label: "",
  },
];

const Checkout = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [paymentGateway, setPaymentGateway] = useState("RAZARPAY");
  const handlePaymentChange = (e: any) => {
    setPaymentGateway(e.target.value);
  };
  return (
    <>
      <div className="pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen">
        <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
          <div className="col-span-2 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>

              <Button>Add new Address</Button>
            </div>
            <div className="text-xs font-medium space-y-5">
              <p>Saved Address</p>
              <div className="space-y-5">
                {[1, 1].map((item) => (
                  <AddressCard />
                ))}
              </div>
            </div>
            <div className="py-4 px-5 rounded-md border">
              <Button onClick={handleOpen}>
                <Add /> Add new Address
              </Button>
            </div>
          </div>
          <div className="space-y-5">
            <div className="border p-5 rounded-md space-y-5">
              <div>
                <h1 className="text-primary-color font-medium text-center">
                  Chose Payment Gateway
                </h1>
              </div>
              <Divider />
              <div>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  className="flex justify-between pr-0"
                  onChange={handlePaymentChange}
                  value={paymentGateway}
                >
                  {paymentGatewayList.map((item) => (
                    <FormControlLabel
                      className={`  w-[45%] pr-2 rounded-md flex justify-center items-center
                        ${
                          paymentGateway === item.value
                            ? "border-primary-color border-2"
                            : "border"
                        }`}
                      value={item.value}
                      control={<Radio />}
                      label={
                        <img
                          className={`${item.value === "stripe" ? "w-14" : ""}`}
                          alt=""
                          src={item.image}
                        />
                      }
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div className="rounded-md  space-y-5 border">
              <PricingCart />
              <div className="p-5">
                <Button fullWidth variant="contained" sx={{ py: "11px" }}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressForm />
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;
