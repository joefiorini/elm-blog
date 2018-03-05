port module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (..)
import Html.Attributes exposing (property, attribute, type_)
import Html.Events exposing (onInput)
import HtmlParser as HtmlParser
import HtmlParser.Util exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Post =
    { title : String
    , date : String
    , content : String
    }


type alias Model =
    { currentPost : Maybe Post
    , firstNumber : Int
    , secondNumber : Int
    , answer : Int
    }


type Msg
    = LoadPost Post
    | SetFirstNumber String
    | SetSecondNumber String
    | SetAnswer Int


port requestPost : String -> Cmd msg


port loadPost : (Post -> msg) -> Sub msg


port sendNumbers : List Int -> Cmd msg


port receiveAnswer : (Int -> msg) -> Sub msg


testPost : String
testPost =
    "0fee0552663a6d82bb03a9e43397ac89486ec802859531beeb9b8e8d39213ecf"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadPost post ->
            { model | currentPost = Just post } ! []

        SetFirstNumber num ->
            case String.toInt num of
                Ok n ->
                    { model | firstNumber = n } ! [ sendNumbers [ n, model.secondNumber ] ]

                Err _ ->
                    model ! []

        SetSecondNumber num ->
            case String.toInt num of
                Ok n ->
                    { model | secondNumber = n } ! [ sendNumbers [ model.firstNumber, n ] ]

                Err _ ->
                    model ! []

        SetAnswer answer ->
            { model | answer = answer } ! []


view : Model -> Html Msg
view model =
    case model.currentPost of
        Just post ->
            main_ []
                [ h1 []
                    [ text post.title ]
                , article
                    []
                    (toVirtualDom <|
                        HtmlParser.parse
                            post.content
                    )
                ]

        Nothing ->
            div []
                [ input [ type_ "number", onInput SetFirstNumber ] []
                , input [ type_ "number", onInput SetSecondNumber ] []
                , text <| toString model.answer
                ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ loadPost LoadPost
        , receiveAnswer SetAnswer
        ]


init : ( Model, Cmd Msg )
init =
    ( Model Nothing 0 0 0, requestPost testPost )
