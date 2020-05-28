const graphql = require('graphql')
const _= require('lodash')
const bookModel = require('../models/book.model')
const authorModel = require('../models/author.model')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql;


const BookType = new GraphQLObjectType({
    name    :   'Book',
    fields  :   ()=>({
        
        id      :   { type : GraphQLID },
        name    :   { type : GraphQLString },
        genre   :   { type : GraphQLString },
        author  :   {
            type    :   AuthorType,
            resolve(parent,args){
                console.log(parent)
                return authorModel.findById(parent.authorId)
                // return _.find(author, {
                //     id : parent.authorId
                // })
            }
        }    
    })
});

const AuthorType = new GraphQLObjectType({
    name    :   'Author',
    fields  :   ()=>({
        
        id      :   { type : GraphQLID },
        name    :   { type : GraphQLString },
        age     :   { type : GraphQLInt },
        book    :   {
            type    :   new GraphQLList(BookType),
            resolve(parent,args){
                console.log(parent)
                return bookModel.find({authorId:  parent.id})
                // return _.filter(books, {
                //     authorId : parent.id
                // })
            }
        }   
    })
});

const RootQuery = new GraphQLObjectType({
    name    :   'RootQueryType',
    fields  :   ()=>({
        
        // find document by id
        book:   {

            type    :   BookType,
            args    :   { 
                
                id  :   { 
                    type : GraphQLID 
                } 

            },
            resolve( parent, args ){
                // code to get data from db 
                return bookModel.findById(args.id)
                // return _.find(books, {
                //     id : args.id
                // })
            }

        },

        // find document by id
        author:   {

            type    :   AuthorType,
            args    :   { 
                
                id  :   { 
                    type : GraphQLID 
                } 

            },
            resolve( parent, args ){
                // code to get data from db 
                return authorModel.findById(args.id)
                // return _.find(author, {
                //     id : args.id
                // })
            }

        },

        // find all documents 
        books   :   {
            type    :   new GraphQLList(BookType),
            resolve(parent,args){
                // return books
                return bookModel.find({})
            }
        },

        // find all documents 
        authors   :   {
            type    :   new GraphQLList(AuthorType),
            resolve(parent,args){
                // return author
                return authorModel.find({})
            }
        }
        
    })
});

const Mutation= new GraphQLObjectType({
    
    name    :   'Mutation',
    
    fields:{
        
        addAuthor:{
            type: AuthorType,
            args:{
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age:{
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve(parent,args){
                let author = new authorModel({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }       
        },
        addBook:{
            type: BookType,
            args:{
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId:{
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent,args){
                let book = new bookModel({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }       
        }
    }

})

module.exports = new GraphQLSchema({

    query   :   RootQuery,
    mutation:   Mutation,

})