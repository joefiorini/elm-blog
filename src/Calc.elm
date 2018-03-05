port module Calc exposing (..)

import Json.Decode


type Msg
    = Input Operation


type alias Operation =
    { num1 : Int
    , num2 : Int
    }


multiply : Int -> Int -> Int
multiply a b =
    a * b


init : ( {}, Cmd Msg )
init =
    ( {}, Cmd.none )


port sendResult : Int -> Cmd msg


port receiveNumbers : (Operation -> msg) -> Sub msg


update : Msg -> {} -> ( {}, Cmd Msg )
update msg model =
    case msg of
        Input operation ->
            ( model, (sendResult <| multiply operation.num1 operation.num2) )


subscriptions : {} -> Sub Msg
subscriptions _ =
    receiveNumbers Input


main : Program Never {} Msg
main =
    Platform.program
        { init = init
        , update = update
        , subscriptions = subscriptions
        }
