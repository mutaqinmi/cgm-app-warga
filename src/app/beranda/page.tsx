'use client';
import Container from "@/components/container";
import NavigationBar from "@/components/navigation-bar";
import WhatsAppShortcut from "@/components/whatsapp-shortcut";

export default function Page(){
    return <NavigationBar sidebarIndex={0}>
        <Container>
            <h1>Hello</h1>
        </Container>
        <WhatsAppShortcut/>
    </NavigationBar>
}