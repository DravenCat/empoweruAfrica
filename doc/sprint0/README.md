# Project Description & Motivation

EmpowerU Africa is designed to teach aspiring entrepreneurs in Africa how to create a successful business. As well as connecting them to potential investors in order to enable them to build market-creating innovations which tackle their country's biggest challenges with technology.

   
# Installation 
__Prerequisites__:

- Node.js ^12.12.0
- MySQL ^8.0.25

__Before you run__:
1. Clone the repository to your machine. 
2. Install node.js packages

    cd into `EmpowerUAfrica` directory, run `npm run install-all`

3. Prepare MySQL database

    Before you run the webapp, you have to make sure your MySQL server is running, and enter your MySQL credentials into `EmpowerUAfrica/db/credentials`, in the following form: 

    ```
    {
        "host": "<host name>",
        "user": "<username>", 
        "password": "<user password>"
    }
    ```

To run the webapp, use

`npm run dev`


# Contribution
We are happy to receive pull requests. If any changes are going to be made,
please open an issue first. We can discuss the change you would like to make.
