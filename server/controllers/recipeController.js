require('../models/database');
const Category=require('../models/Category')
const Recipe=require('../models/Recipe')



// GET/HOMEPAGE
exports.homepage = async(req,res) => {


    try{
        const limitNumber =5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest= await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const thai=await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american=await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese=await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
        const food={latest,thai,chinese,american};


        res.render('index',{title: 'Slurp!',categories,food});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}


// GET/Categories
exports.exploreCategories = async(req,res) => {


    try{
        const limitNumber =20;
        const categories = await Category.find({}).limit(limitNumber);


        res.render('categories',{title: 'Slurp! categories',categories});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}


// GET/Categories/id
exports.exploreCategoriesById = async(req,res) => {


    try{
        let categoryId=req.params._id;
        const limitNumber =20;
        const categoryById = await Recipe.find({'category':categoryId}).limit(limitNumber);


        res.render('categories',{title: 'Slurp! categories',categoryById});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}

// GET/Recipe/:id
exports.exploreRecipe = async(req,res) => {


    try{
        
        let recipeId=req.params._id;
        //const recipes = await Recipe.find();
        const recipe = await Recipe.findById(recipeId);

        res.render('recipe',{title: 'Slurp! Recipe ',recipe});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}


// Post/search
exports.searchRecipe = async(req,res) => {

    //searchTerm
    try{
        let searchTerm=req.body.searchTerm;
        let recipe=await Recipe.find({$text:{$search:searchTerm,$diacriticSensitive: true}});
        //res.json(recipe);
        res.render('search',{title: 'Slurp! Search ',recipe});

    }catch(error){

    }
}


// GET/explore-latest
exports.exploreLatest = async(req,res) => {


    try{
        
        const limitNumber=20;
        const recipe=await Recipe.find({}).sort({_id: -1}).limit(limitNumber);

        res.render('explore-latest',{title: 'Slurp! Explore-latest ',recipe});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}


// GET/exploreRandom
exports.exploreRandom = async(req,res) => {


    try{
        
        let count=await Recipe.find().countDocuments();
        let random=Math.floor(Math.random()*count);
        let recipe=await Recipe.findOne().skip(random).exec();

        res.render('explore-random',{title: 'Slurp! Explore-latest ',recipe});

    } catch (error){
        res.status(500).send({message: error.message|| "Error Occurred"});
    }
}


// GET/submit recipe
exports.submitRecipe = async(req,res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe',{title: 'Slurp! Submit Recipe',infoErrorsObj,infoSubmitObj});


}


// GET/submit recipe
exports.submitRecipeOnPost = async(req,res) => {
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No files were uploaded.');
        }
        else{
            imageUploadFile=req.files.image;
            newImageName=Date.now()+imageUploadFile.name;
            uploadPath=require('path').resolve('./')+'/public/uploads/'+newImageName;

            imageUploadFile.mv(uploadPath,function(err){
                if(err)
                    return res.status(500).send(err);
                })
            }
        

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        });
        await newRecipe.save();
        req.flash('infoSubmit','Recipe has been added.')
        res.redirect('/submit-recipe');
    }catch(error){
        req.flash('infoErrors',error)
        res.redirect('/submit-recipe');

    }

}










// async function insertDummyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chineese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             },
//         ]);
//     }catch(error){
//         console.log('err',error)
//     }
// }

// insertDummyCategoryData();



// async function insertDummyRecipeData(){
//     try{
//         await Recipe.insertMany([
//             {
//                 name: 'Tacos',
//                 description: 'Delicious Mexican tacos filled with seasoned ground beef, lettuce, cheese, and salsa.',
//                 email: 'cook@example.com',
//                 ingredients: ['tortillas', 'ground beef', 'lettuce', 'cheese', 'salsa'],
//                 category: 'Mexican',
//                 image: 'tacos.jpg'
//             },
//             {
//                 name: 'Pad Thai',
//                 description: 'A classic Thai dish made with stir-fried noodles, shrimp, tofu, peanuts, and bean sprouts.',
//                 email: 'chef@example.com',
//                 ingredients: ['rice noodles', 'shrimp', 'tofu', 'peanuts', 'bean sprouts'],
//                 category: 'Thai',
//                 image: 'pad_thai.jpg'
//             },
//             {
//                 name: 'Chicken Tikka Masala',
//                 description: 'A popular Indian dish featuring tender chicken cooked in a creamy tomato-based sauce.',
//                 email: 'cook@example.com',
//                 ingredients: ['chicken', 'yogurt', 'tomato', 'cream', 'spices'],
//                 category: 'Indian',
//                 image: 'chicken_tikka_masala.jpg'
//             },
//             {
//                 name: 'Spaghetti Bolognese',
//                 description: 'Classic Italian pasta dish with a hearty meat sauce, perfect for family dinners.',
//                 email: 'chef@example.com',
//                 ingredients: ['spaghetti', 'ground beef', 'tomato sauce', 'onion', 'garlic'],
//                 category: 'Mexican',
//                 image: 'spaghetti_bolognese.jpg'
//             },
//             {
//                 name: 'Sushi Rolls',
//                 description: 'Delicious Japanese sushi rolls filled with fresh fish, avocado, and cucumber.',
//                 email: 'sushi_chef@example.com',
//                 ingredients: ['sushi rice', 'fish', 'avocado', 'cucumber', 'seaweed'],
//                 category: 'Chinese',
//                 image: 'sushi_rolls.jpg'
//             },
//             {
//                 name: 'Caesar Salad',
//                 description: 'Classic Caesar salad with crisp romaine lettuce, homemade croutons, and tangy dressing.',
//                 email: 'salad_lover@example.com',
//                 ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese', 'Caesar dressing'],
//                 category: 'American',
//                 image: 'caesar_salad.jpg'
//             },
//             {
//                 name: 'Beef Stir-Fry',
//                 description: 'Quick and flavorful Chinese stir-fry with tender beef, colorful vegetables, and savory sauce.',
//                 email: 'chef@example.com',
//                 ingredients: ['beef', 'bell peppers', 'broccoli', 'soy sauce', 'ginger', 'garlic'],
//                 category: 'Chinese',
//                 image: 'beef_stir_fry.jpg'
//             },
//             {
//                 name: 'Margherita Pizza',
//                 description: 'Classic Italian pizza topped with fresh tomatoes, mozzarella cheese, and basil leaves.',
//                 email: 'pizza_lover@example.com',
//                 ingredients: ['pizza dough', 'tomatoes', 'mozzarella cheese', 'basil', 'olive oil'],
//                 category: 'Thai',
//                 image: 'margherita_pizza.jpg'
//             },
//             {
//                 name: 'Guacamole',
//                 description: 'Creamy and zesty Mexican dip made with ripe avocados, tomatoes, onions, and lime juice.',
//                 email: 'guacamole_master@example.com',
//                 ingredients: ['avocados', 'tomatoes', 'onion', 'lime juice', 'cilantro'],
//                 category: 'Mexican',
//                 image: 'guacamole.jpg'
//             },
//             {
//                 name: 'Chicken Curry',
//                 description: 'Spicy and aromatic Indian curry made with tender chicken, onions, tomatoes, and fragrant spices.',
//                 email: 'curry_chef@example.com',
//                 ingredients: ['chicken', 'onion', 'tomato', 'coconut milk', 'curry spices'],
//                 category: 'Indian',
//                 image: 'chicken_curry.jpg'
//             },
//             {
//                 name: 'Caprese Salad',
//                 description: 'Light and refreshing Italian salad featuring fresh tomatoes, mozzarella cheese, and basil leaves drizzled with balsamic glaze.',
//                 email: 'salad_lover@example.com',
//                 ingredients: ['tomatoes', 'mozzarella cheese', 'basil', 'balsamic glaze'],
//                 category: 'Thai',
//                 image: 'caprese_salad.jpg'
//             },
//             {
//                 name: 'Gyoza',
//                 description: 'Japanese dumplings filled with savory ground pork, cabbage, and garlic, pan-fried to crispy perfection.',
//                 email: 'gyoza_chef@example.com',
//                 ingredients: ['ground pork', 'cabbage', 'garlic', 'gyoza wrappers', 'soy sauce', 'sesame oil'],
//                 category: 'Thai',
//                 image: 'gyoza.jpg'
//             },
//             {
//                 name: 'Beef Tacos',
//                 description: 'Classic Mexican street food featuring seasoned ground beef, fresh toppings, and a squeeze of lime, all wrapped in warm tortillas.',
//                 email: 'taco_lover@example.com',
//                 ingredients: ['ground beef', 'tortillas', 'lettuce', 'tomatoes', 'cheese', 'lime'],
//                 category: 'Mexican',
//                 image: 'beef_tacos.jpg'
//             },
//             {
//                 name: 'Chicken Alfredo Pasta',
//                 description: 'Creamy Italian pasta dish with tender chicken, fettuccine noodles, and a rich Alfredo sauce made with parmesan cheese and garlic.',
//                 email: 'pasta_chef@example.com',
//                 ingredients: ['chicken', 'fettuccine noodles', 'heavy cream', 'parmesan cheese', 'garlic'],
//                 category: 'Mexican',
//                 image: 'chicken_alfredo_pasta.jpg'
//             },
//             {
//                 name: 'Hummus',
//                 description: 'Smooth and creamy Middle Eastern dip made with chickpeas, tahini, lemon juice, and garlic, perfect for dipping pita bread or veggies.',
//                 email: 'hummus_master@example.com',
//                 ingredients: ['chickpeas', 'tahini', 'lemon juice', 'garlic', 'olive oil'],
//                 category: 'Thai',
//                 image: 'hummus.jpg'
//             },
//             {
//                 name: 'Spicy Szechuan Noodles',
//                 description: 'Fiery Chinese noodles tossed in a spicy Szechuan sauce with ground pork, veggies, and peanuts, for an explosion of flavors in every bite.',
//                 email: 'noodle_lover@example.com',
//                 ingredients: ['egg noodles', 'ground pork', 'vegetables', 'peanuts', 'Szechuan sauce'],
//                 category: 'Chinese',
//                 image: 'spicy_szechuan_noodles.jpg'
//             }
//         ]);
//     }catch(error){
//         console.log('err',error)
//     }
// }

// insertDummyRecipeData();

