import type * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const demo: React.ReactNode = (
    <Tabs defaultValue="one" className="max-w-md">
      <TabsList>
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Code</TabsTrigger>
        <TabsTrigger value="three">Deploy</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Ship polished UI faster.</TabsContent>
      <TabsContent value="two">Copy the source into your repo.</TabsContent>
      <TabsContent value="three">No runtime lock-in.</TabsContent>
    </Tabs>
  )

export default demo
