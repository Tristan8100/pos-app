import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import {DiscountCreate} from "../types/discount.types"

type Props = {
    create: (data: DiscountCreate)=> void,
}

export default function CreateDiscount({create}: Props) {
    const [discount, setDiscount] = useState<DiscountCreate>({
        name: '',
        discount: 0,
        remove_vat: false
    })

    const submit = () => {
        create(discount)
    }

  return (
    <Dialog>
    <DialogTrigger className="border">Add Discount</DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
            <Input placeholder="Enter discount name" value={discount.name} onChange={(e) => setDiscount({...discount, name: e.target.value})}/>
            <Input placeholder="Enter discount value" value={discount.discount} onChange={(e) => setDiscount({ ...discount, discount: Number(e.target.value) })} />
            <Switch
                id="vat"
                checked={discount.remove_vat}
                onCheckedChange={() => setDiscount({ ...discount, remove_vat: !discount.remove_vat })}
            />
            <Button onClick={submit}>Create</Button>
        </DialogDescription>
        </DialogHeader>
    </DialogContent>
    </Dialog>
  )
}