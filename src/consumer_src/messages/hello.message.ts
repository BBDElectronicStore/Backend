/**
 * @enum HelloMessage
 * All of our messages should be in the form of an enum
 * we should have a default and an err value for each message
 * this is done so that we can see all the messages we have currently
 * Maybe we send through a message that is not handled and we can find here that we don't have an enum for it
 */
export enum HelloMessage {
    default = "HELLO_MESSAGE",
    err = "HELLO_MESSAGE_ERR"
}