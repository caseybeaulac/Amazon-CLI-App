var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // port
    port: 3306,

    // username
    user: "root",

    // password & db name
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection ID: " + connection.threadId);
    ready();
});

function ready() {
    console.log("\n++++++++++++ Available Items ++++++++++++\n")
    connection.query("SELECT Item_ID, Product, Price FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        inquirer.prompt(
            {
                name: "buy",
                type: "list",
                message: "Which item would you like to purchase?",
                choices: ["Sony Headphones", "Cuisinart Toaster", "Windshield Wipers", "Samsung Tablet", "Lamp", "Computer Chair", "iPhone Charger", "Coleman Tent", "Car Floor Mat", "Skateboard"]
            }
        ).then(function (answer) {
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    if(answer.buy == res[i].Product){
                        console.log("You selected "+ res[i].Product+ " at " + res[i].Price +"$ each.")
                        var price = res[i].Price;
                        var stock = res[i].Stock;
                        var item = res[i].Product;
                        var iid = res[i].Item_ID;
                        
                        inquirer.prompt(
                            {
                                name: "amount",
                                type: "input",
                                message: "How many " + item + "s would you like to buy?",
                            }
                        ).then(function(answer){
                            if(stock < answer.amount){
                                console.log("Insufficient quantity!")
                                inquirer.prompt(
                                    {
                                        name: "shop",
                                        type: "confirm",
                                        message: "Would you like to keep shopping?"
                                    }
                                ).then(function(answer){
                                    if(answer.shop){
                                        ready();
                                    }else{
                                        connection.end();
                                    }
                                })
                             
                            }else{
                                connection.query("UPDATE products SET Stock = Stock -" +answer.amount+ " WHERE Item_ID =" + iid)
                                console.log("Purchase successful, you bought " +answer.amount, item +"s for a total of "+ price * answer.amount)

                                inquirer.prompt(
                                    {
                                        name: "shop",
                                        type: "confirm",
                                        message: "Would you like to keep shopping?"
                                    }
                                ).then(function(answer){
                                    if(answer.shop){
                                        ready();
                                    }else{
                                        connection.end();
                                    }
                                })
                            }
                        })
                    }
                  

                }
            })
            //    

            // inquirer
            //     .prompt({
            //         name: "continue",
            //         type: "confirm",
            //         message: "Would you like to buy something?",
            //     })
            //     .then(function (answer) {
            //         if (answer.continue) {
            //             inquirer.prompt([
            //                 {
            //                     name: "id",
            //                     type: "list",
            //                     message: "Which item would you like to buy?",
            //                     choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            //                 },
            //                 {
            //                     name: "amount",
            //                     type: "input",
            //                     message: "How many would you like to purchase?"
            //                 }
            //             ])
            //                 .then(function (answer) {
            //                     connection.query(
            //                         "UPDATE products SET Stock = Stock -" +answer.amount+ " WHERE Item_ID =" + answer.id,
            //                         function(err) {
            //                             if (err) throw err;
            //                             console.log("The purchase was successful. You bought " +answer.amount, item + "(s)!");

            //                             ready();
            //                           }

            //                     )
            //                 })

            //         } else {
            //             connection.end();
            //         }
            //     })

        });
    })
}
