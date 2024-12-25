we use signIn to make the signIn 
and after chosing the google account we use session to see if user is created or not.

when using SESSION we will have a erroe that app should be wraped in SESSION PROVIDER so what we can do WRAP child in layout but this will give useClient error and we should not make ROOT LAYOUT "use Client"
so we create a PROVIDER.tsx and we wrap our app inside the provider