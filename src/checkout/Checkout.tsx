import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { OrderSummaryList } from "./OrderSummary";
import classes from "./Checkout.module.css";
import "@mantine/core/styles.css";
import bg from "./bg.png";

import { useContext, useEffect, useState } from "react";
import { sessionContext } from "../App";
import { Timer } from "./Timer";
import { EventApi } from "../api/eventApi";

export function Checkout() {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const context = useContext(sessionContext);

  const orderData = [
    { title: "Event:", description: context?.orderData.event_title },
    {
      title: "Tickets:",
      description: `${context?.orderData.quantity} x ${context?.orderData.ticket_type}`,
    },
    {
      title: "Original Price:",
      description: `${
        (context?.orderData.price ?? 0) * (context?.orderData.quantity ?? 0)
      }$`,
    },
    { title: "Discount:", description: "0$" },
    {
      title: "Price After Discount:",
      description: `${
        (context?.orderData.price ?? 0) * (context?.orderData.quantity ?? 0)
      }$`,
    },
  ];

  // let MOCKDATA = [
  //   { title: "Event:", description: "Maccabi Haifa match" },
  //   { title: "Tickets:", description: "2 X Gold Seats" },
  //   { title: "Original Price:", description: "100$" },
  //   { title: "Discount:", description: "0$" },
  //   { title: "Price After Discount:", description: "100$" },
  // ];
  const [orderDetails, setOrderDetails] = useState(orderData);
  console.log(orderDetails);
  const originalPrice = parseInt(
    orderData[2]?.description?.slice(0, -1) ?? "0"
  );

  const [paymentDetails, setPaymentDetails] = useState({
    holder: "",
    cc: "",
    exp: "",
    cvv: "",
    charge: originalPrice,
  });

  useEffect(() => {
    const priceAfterDiscount = originalPrice - discount;
    setPaymentDetails({ ...paymentDetails, charge: priceAfterDiscount });

    setOrderDetails([
      ...orderDetails.slice(0, 3), // Keep the first three items unchanged
      { title: "Discount:", description: `${discount}$` },
      { title: "Price After Discount:", description: `${priceAfterDiscount}$` },
    ]);

    console.log(orderDetails);
  }, [discount]);

  const activateCoupon = (coupon: string) => {
    if (coupon === "maccabi") {
      setDiscount(30);
      console.log("Coupon Activated");
    }
  };

  const handleFormSubmit = () => {
    console.log("Payment Details:", paymentDetails);
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  //TODO: add form validations
  const handleRollBack = async () => {
    console.log("Rolling back");
    const ticketsToRollBack = {
      ticket_type: context?.orderData.ticket_type ?? "",
      quantity: -(context?.orderData.quantity ?? 0),
    };
    const res = await EventApi.updateEventTicket(
      context?.eventId ?? "",
      ticketsToRollBack
    );
    console.log(
      `RolledBack ${ticketsToRollBack.quantity} tickets of type ${ticketsToRollBack.ticket_type} `,
      res
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        placeContent: "center",
        placeItems: "center",
        height: "80vh",
      }}
    >
      <Timer onComplete={handleRollBack} />
      <Paper shadow="md" radius="lg">
        <div className={classes.wrapper}>
          <div
            className={classes.contacts}
            style={{ backgroundImage: `url(${bg})` }}
          >
            <Text fz="xl" fw={700} className={classes.title} c="#fff">
              Order Summary
            </Text>

            <OrderSummaryList orderDetails={orderDetails} />
          </div>
          <form
            className={classes.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <Text fz="xl" fw={700} mb={30} className={classes.title}>
              Checkout
            </Text>

            <div className={classes.fields}>
              <TextInput
                style={{ marginTop: "15px" }}
                label="Your name"
                placeholder="English letters only"
                required
                value={paymentDetails.holder}
                onChange={handleInputChange}
                name="holder"

                //{...form.getInputProps("holder")}
              />
              <TextInput
                style={{ marginTop: "15px" }}
                label="Credit card number"
                placeholder="0-9 digits only"
                required
                value={paymentDetails.cc}
                onChange={handleInputChange}
                name="cc"
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  style={{ marginTop: "15px" }}
                  label="Expiration date"
                  placeholder="MM/YY"
                  required
                  value={paymentDetails.exp}
                  onChange={handleInputChange}
                  name="exp"
                />
                <TextInput
                  style={{ marginTop: "15px" }}
                  label="cvv"
                  placeholder="cvv"
                  required
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  name="cvv"
                />
              </SimpleGrid>
              <div className={classes.controlscpn}>
                <TextInput
                  mb={15}
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="Insert Coupon Code"
                  classNames={{
                    input: classes.inputcpn,
                    root: classes.inputWrappercpn,
                  }}
                />
                <Button
                  className={classes.controlcpn}
                  onClick={() => activateCoupon(coupon)}
                >
                  Activate
                </Button>
              </div>

              <Group justify="flex-start" mt="md">
                <Button
                  type="submit"
                  className={classes.control}
                  onClick={handleFormSubmit}
                >
                  Buy Now
                </Button>
              </Group>
            </div>
          </form>
        </div>
      </Paper>
    </div>
  );
}
