port module Main exposing (Model, Msg, update, view, subscriptions, init)

import Html exposing (..)
import Html.Attributes exposing (property, attribute)
import Json.Encode exposing (string)
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
    { currentPost : Maybe Post }


type Msg
    = LoadPost Post


port requestPost : String -> Cmd msg


port loadPost : (Post -> msg) -> Sub msg


testPost =
    "0fee0552663a6d82bb03a9e43397ac89486ec802859531beeb9b8e8d39213ecf"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadPost post ->
            { model | currentPost = Just post } ! []


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
                [ text "New Html Program" ]


subscriptions : Model -> Sub Msg
subscriptions model =
    loadPost LoadPost


init : ( Model, Cmd Msg )
init =
    ( Model Nothing, requestPost testPost )
