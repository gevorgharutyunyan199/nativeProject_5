import {Colors} from "./assets/RootStyles";

export const makeTheme = (isCurrentUser) => {
    return {
        messageSimple: {
            content: {
                textContainer: {
                    backgroundColor: isCurrentUser ? Colors.messageBubble1 :  Colors.messageBubble2,
                    minHeight: 44,
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                markdown: {
                    text: {
                        color: isCurrentUser ? "#ffffff" :  "#000000"
                    }
                },
            },
        },
    }
}
